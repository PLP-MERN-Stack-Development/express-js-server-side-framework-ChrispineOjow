import { Product } from '../Model/products.js';

const pagination = async (req, res, next) => {
    // 1. Get page and limit from query parameters
    // Set default values if they are not provided
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    try {
        // 2. Calculate the number of documents to skip (the offset)
        // Skip = (Page Number - 1) * Limit
        const skip = (page - 1) * limit;

        // 3. Get the total count of documents (for metadata)
        const totalItems = await Product.countDocuments();
        
        // 4. Fetch the paged products
        const products = await Product.find()
            .skip(skip) // Apply the offset
            .limit(limit); // Apply the page size

        // 5. Calculate total pages
        const totalPages = Math.ceil(totalItems / limit);

        // 6. Send the structured response
        res.status(200).json({
            status: 'success',
            currentPage: page,
            limit: limit,
            totalItems: totalItems,
            totalPages: totalPages,
            products: products,
        });

    } catch (error) {
        console.error("Pagination Error:", error);
        res.status(500).json({ message: 'Server Error occurred while listing products.' });
    }
}

export default pagination;