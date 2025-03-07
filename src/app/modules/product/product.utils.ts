import { v4 as uuidv4 } from 'uuid';

function GenerateRandomProductSlug() {
  const uuid = uuidv4();
  const alphanumeric = uuid.replace(/[^a-z0-9]/gi, '');
  return `MED-${alphanumeric.substring(0, 6).toUpperCase()}`;
}

const ProductUtils = { GenerateRandomProductSlug };

export default ProductUtils;
