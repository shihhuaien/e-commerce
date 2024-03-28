export default {
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
        {
            name: 'recipient',
            title: 'Recipient',
            type: 'string',
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
        },
        {
            name: 'productName',
            title: 'ProductName',
            type: 'string',
        },
        {
            name: 'qty',
            title: 'Qty',
            type: 'string',
        },
        {
            name: 'address',
            title: 'Address',
            type: 'string',
        },
        {
            name: 'phone',
            title: 'Phone',
            type: 'string',
        }, {
            name: 'comment',
            title: 'Comment',
            type: 'string',
        },
        {
            name: 'dayTime',
            title: 'DayTime',
            type: 'string',
        },
    ]
}