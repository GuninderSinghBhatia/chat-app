export function RoomLogic() {
     const min = 10000
    const max = 99999
  const code =  Math.floor(Math.random() * (max - min) + min);
  return code;
}