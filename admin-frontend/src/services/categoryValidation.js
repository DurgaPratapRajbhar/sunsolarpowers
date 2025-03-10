const formValidation = (value, fieldName, options = {}) => {
    const {
        required = true,
        minLength = 3,
        maxLength = 100,
        pattern = null,
        patternMessage = null,
    } = options;

    if (required && (!value || value.trim() === "")) {
        return `${fieldName} is required`;
    }

    value = value ? value.trim() : "";

    if (minLength && value.length < minLength) {
        return `${fieldName} must be at least ${minLength} characters long`;
    }

    if (maxLength && value.length > maxLength) {
        return `${fieldName} must not exceed ${maxLength} characters`;
    }

    if (pattern && !pattern.test(value)) {
        return patternMessage || `Invalid ${fieldName} format`;
    }

    return null;  
};

const validateSlug = (value) => {
    return formValidation(value, "Slug", {
        pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        patternMessage: "Slug must only contain lowercase letters, numbers, and dashes",
    });
};

const validateImage = (file, fieldName = "Image", options = {}) => {
    return new Promise((resolve) => {
        const {
            required = true,
            allowedTypes = ["image/jpeg", "image/png", "image/webp"],
            maxSize = 2 * 1024 * 1024, // Default 2MB
            minWidth = 500,
            minHeight = 500,
            square = true,
        } = options;

        if (required && !file) {
            return resolve({ error: `${fieldName} is required`, file: null });
        }

        if (file && !allowedTypes.includes(file.type)) {
            return resolve({ error: `Only JPG, PNG, and WebP images are allowed for ${fieldName}.`, file: null });
        }

        if (file && file.size > maxSize) {
            return resolve({ error: `${fieldName} size must be less than ${maxSize / (1024 * 1024)}MB.`, file: null });
        }

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            const { width, height } = img;

            if (square && width !== height) {
                return resolve({ error: `${fieldName} must have a square aspect ratio (1:1).`, file: null });
            }

            if (width < minWidth || height < minHeight) {
                return resolve({
                    error: `${fieldName} must be at least ${minWidth}x${minHeight} pixels.`,
                    file: null,
                });
            }

            resolve({ error: null, file });
        };

        img.onerror = () => {
            resolve({ error: `Invalid ${fieldName} file.`, file: null });
        };
    });
};

export { formValidation, validateSlug, validateImage };
