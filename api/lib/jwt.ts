import { verify, decode } from "jsonwebtoken";
import axios from "axios";

export const verifyToken = async (authHeader: string) => {
  await fetchJWKS("trun.eu.auth0.com");

  const token = extractAuthenicationToken(authHeader);

  const decodedToken = decode(token, { complete: true });
  const { header } = decodedToken;

  if (!header || header.alg !== "RS256") {
    throw new Error("Token is not RS256 encoded");
  }

  const key = getJWKSSigningKey(header.kid);
  const actualKey = key.publicKey || key.rsaPublicKey;

  return new Promise((resolve, reject) => {
    verify(
      token,
      actualKey,
      {
        algorithms: ["RS256"],
        issuer: "https://trun.eu.auth0.com/",
        audience: "trun",
      },
      (err, decoded) => {
        if (err) {
          reject(new Error("invalid_token"));
        } else {
          resolve(decoded);
        }
      }
    );
  });
};

function certToPEM(cert) {
  let pem = cert.match(/.{1,64}/g).join("\n");
  pem = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
  return pem;
}

let jwks = null;

async function fetchJWKS(tenant) {
  if (jwks) return;

  const res = await axios.get(`https://${tenant}/.well-known/jwks.json`, {});

  if (res.status < 200 || res.status >= 300) {
    throw new Error(res.data && (res.data.message || res.data));
  } else {
    jwks = res.data.keys;
  }
}

function getJWKS() {
  return jwks;
}

function getJWKSSigningKeys() {
  return jwks
    .filter(
      (key) =>
        key.use === "sig" && // JWK property `use` determines the JWK is for signing
        key.kty === "RSA" && // We are only supporting RSA (RS256)
        key.kid && // The `kid` must be present to be useful for later
        ((key.x5c && key.x5c.length) || (key.n && key.e)) // Has useful public keys
    )
    .map((key) => ({
      kid: key.kid,
      nbf: key.nbf,
      publicKey: certToPEM(key.x5c[0]),
    }));
}

function getJWKSSigningKey(kid) {
  return getJWKSSigningKeys().find((key) => key.kid === kid);
}

function extractAuthenicationToken(authHeader = "") {
  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    throw new Error("No authorization token was found");
  }

  const scheme = parts[0];
  if (!/^Bearer$/i.test(scheme)) {
    throw new Error("Format is Authorization: Bearer [token]");
  }

  return parts[1];
}
