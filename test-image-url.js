// Test the normalize function logic
const normalizeImageUrl = (img, backendUrl) => {
    if (!img) return img;
    const cleanBackend = (backendUrl || '').replace(/\/$/, '');

    if (/^https?:\/\//i.test(img)) {
        try {
            const url = new URL(img);
            if (url.pathname.includes('/products/')) {
                const fileName = url.pathname.split('/products/')[1];
                return `${cleanBackend}/products/${fileName}`;
            }
            return img;
        } catch (e) {
            return img;
        }
    }

    // relative like "/products/x" or just filename
    const fileName = img.includes('/products/') ? img.split('/products/')[1] : img.replace(/^\/+/, '');
    return `${cleanBackend}/products/${fileName}`;
};

// Test with a sample filename
const backendUrl = 'http://localhost:4000';
const testFilename = '002b0ef709a4ab86d8b3bd1e0aad2410-bottomwomen8.jpg';
const result = normalizeImageUrl(testFilename, backendUrl);
console.log('Generated URL:', result);

// Test with a full URL
const testFullUrl = 'http://localhost:4000/products/002b0ef709a4ab86d8b3bd1e0aad2410-bottomwomen8.jpg';
const result2 = normalizeImageUrl(testFullUrl, backendUrl);
console.log('Normalized full URL:', result2);