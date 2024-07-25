export const convertAddress = (address: string) => {
  const startAddress = address.substring(0, 5);
  const endAddress = address.substring(address.length - 2, address.length);
  return `${startAddress}...${endAddress}`;
};
