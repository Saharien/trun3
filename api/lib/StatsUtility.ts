export function timeConvert(n) {
  const num = n;
  const hours = num / 60;
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.trunc(minutes);
  const seconds = n - Math.trunc(n);
  return rhours + ":" + rminutes + ":" + seconds.toString().substring(2, 4);
}

export function calculatePace(minutes, km) {
  const pace = minutes / km;
  const paceMinutes = Math.floor(pace);
  const paceSeconds = Math.round((pace - paceMinutes) * 60);

  const paceSecondsString =
    paceSeconds < 10 ? "0" + paceSeconds : paceSeconds.toString();

  return Number.parseFloat(`${paceMinutes}.${paceSecondsString}`);
}
