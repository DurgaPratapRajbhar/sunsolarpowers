const formValidation = (value, fieldName, options = {}) => {
    const {
        required = true,
        minLength = 1,
        maxLength = 100,
        pattern = null,
        patternMessage = null,
        isNumber = false,
        min = null,
        max = null,
        enumValues = null,
        isEmail = false,
        isPhone = false,
        isURL = false,
        isPositiveInteger = false,
    } = options;

    if (required && (!value || value.toString().trim() === "")) {
        return `${fieldName} is required`;
    }

    value = value ? value.toString().trim() : "";

    if (minLength && value.length < minLength) {
        return `${fieldName} must be at least ${minLength} characters long`;
    }

    if (maxLength && value.length > maxLength) {
        return `${fieldName} must not exceed ${maxLength} characters`;
    }

    if (pattern && !pattern.test(value)) {
        return patternMessage || `Invalid ${fieldName} format`;
    }

    if (isNumber) {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            return `${fieldName} must be a number`;
        }
        if (min !== null && numValue < min) {
            return `${fieldName} must be at least ${min}`;
        }
        if (max !== null && numValue > max) {
            return `${fieldName} must not exceed ${max}`;
        }
    }

    if (isPositiveInteger) {
        if (!/^\d+$/.test(value)) {
            return `${fieldName} must be a positive integer`;
        }
    }

    if (isEmail) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            return `Invalid email format`;
        }
    }

    if (isPhone) {
        const phonePattern = /^[0-9]{10,15}$/;
        if (!phonePattern.test(value)) {
            return `Invalid phone number format`;
        }
    }

    if (isURL) {
        try {
            new URL(value);
        } catch (_) {
            return `Invalid URL format`;
        }
    }

    if (enumValues && !enumValues.includes(value)) {
        return `${fieldName} must be one of: ${enumValues.join(", ")}`;
    }

    return null;  
};

// Slug Validation (Lowercase, Alphanumeric, and Dashes Allowed)
const validateSlug = (value) => {
    return formValidation(value, "Slug", {
        pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        patternMessage: "Slug must only contain lowercase letters, numbers, and dashes",
    });
};

// SKU Validation (Alphanumeric and Dashes Allowed)
const validateSKU = (value) => {
    return formValidation(value, "SKU", {
        pattern: /^[a-zA-Z0-9-]+$/,
        patternMessage: "SKU must be alphanumeric and can include dashes",
    });
};

export { formValidation, validateSlug, validateSKU };
