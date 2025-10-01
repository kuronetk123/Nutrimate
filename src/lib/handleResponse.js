export async function handleResponse(response) {
    const data = await response.json()
  
    if (!response.ok) {
      throw new Error(data.error || "API request failed")
    }
  
    return data
  }