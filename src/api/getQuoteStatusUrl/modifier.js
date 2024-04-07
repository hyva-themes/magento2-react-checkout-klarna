export default function updateQuoteEmailUrlModifier(response) {
  const result = { isActive: false };

  if (!response) {
    return result;
  }

  const responseJson = JSON.parse(response);
  result.isActive = !!Number(responseJson.is_active);

  return result;
}
