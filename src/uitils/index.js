export function quake_level(M) {
  const level = parseFloat(M);
  if (level < 3) {
    return 1;
  } else if (3 <= level && level < 5) {
    return 2;
  } else {
    return 3;
  }
}
export function quake_time(time) {
  const quakeTimeCode = new Date(time).getTime();
  const dayTimeCode = new Date().getTime() - 60 * 60 * 24 * 1000;
  const weekTimeCode = new Date().getTime() - 60 * 60 * 24 * 1000 * 7;
  if (quakeTimeCode < weekTimeCode) {
    return 3;
  } else if (dayTimeCode > quakeTimeCode && quakeTimeCode > weekTimeCode) {
    return 2;
  } else {
    return 1;
  }
}


