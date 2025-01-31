window.function = async function(api_key, vector_store_id, file_ids) {
    // Validate API Key
    if (!api_key.value) {
        return "Error: OpenAI API Key is required.";
    }

    // Validate Vector Store ID
    if (!vector_store_id.value) {
        return "Error: Vector Store ID is required.";
    }

    // Validate File IDs
    let fileIdsValue;
    if (file_ids.value) {
        try {
            fileIdsValue = JSON.parse(file_ids.value);
            if (!Array.isArray(fileIdsValue)) {
                return "Error: File IDs should be an array of strings.";
            }
        } catch (e) {
            return "Error: Invalid JSON format for file_ids.";
        }
    } else {
        return "Error: File IDs are required.";
    }

    // Construct request payload
    const payload = {
        file_ids: fileIdsValue
    };

    // API endpoint URL
    const apiUrl = `https://api.openai.com/v1/vector_stores/${vector_store_id.value}/file_batches`;

    // Make API request
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${api_key.value}`,
                "OpenAI-Beta": "assistants=v2"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return `Error ${response.status}: ${errorData.error?.message || "Unknown error"}`;
        }

        // Parse and return the response
        const responseData = await response.json();
        return JSON.stringify(responseData, null, 2);

    } catch (error) {
        return `Error: Request failed - ${error.message}`;
    }
};
