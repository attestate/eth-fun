//@format
export default function getStorageLocation(contract, soughtLabel) {
  const { storageLayout } = contract;
  return storageLayout.storage.find(({ label }) => label === soughtLabel);
}
