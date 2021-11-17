module.exports = (sequelize, dataTypes) => {
    const alias = 'Product';
    const cols = {
        id: {
            type: dataTypes.INTEGER,
            allowNull: false,
            autoincrement: true,
            primaryKey: true,
            unique: true
            
        },
        name: {
            type: dataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: dataTypes.STRING(300),
            allowNull: false
        },
        price: {
            type: dataTypes.DECIMAL(7,2),
            allowNull: false      
        },
        discount: {
            type: dataTypes.DECIMAL(4,2),
            allowNull: false      
        },
        quantity_S: {
            type: dataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            defaultValue: 0
        },
        quantity_M: {
            type: dataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            defaultValue: 0
        },
        quantity_L: {
            type: dataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            defaultValue: 0
        },
        image_1: {
            type: dataTypes.STRING(100),
            allowNull: true,
            defaultValue: "default-image.svg",
        },
        image_2: {
            type: dataTypes.STRING(100),
            allowNull: true,
            defaultValue: "default-image.svg",
        },
        category_id : {
            type: dataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        material_id : {
            type: dataTypes.INTEGER.UNSIGNED,
            allowNull: false
        }
    }
    const config = {
        tableName: 'products',
        timestamps: false
    }
    const Product = sequelize.define(alias, cols, config)

    return Product;
}