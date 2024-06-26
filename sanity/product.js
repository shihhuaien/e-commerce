export default {
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        {
            name: 'image',
            title: 'Image',
            type: 'array',
            of: [{ type: 'image' }],
            option: {
                hotspot: true,
            }
        },
        {
            name: 'name',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            option: {
                source: 'name',
                maxLength: 90,
                slugify: input => input
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .slice(0, 200)
            },
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
        },
        {
            name: 'details',
            title: 'Details',
            type: 'string',
        },
        {
            name: 'inventory',
            title: 'Inventory',
            type: 'number',
        },
        {
            name: 'star',
            title: 'Star',
            type: 'number',
        },
        {
            name: 'sellerExperience',
            title: 'SellerExperience',
            type: 'string',
        }
    ]
}