module.exports = (sequelize, dataTypes) => {
    const alias = 'Material';
    const cols = {
        id: {
            type: dataTypes.INTEGER,
            allowNull: false,
            autoincrement: true,
            primaryKey: true,
            unique: true
            
        },
        name: {
            type: dataTypes.STRING(50),
            allowNull: false
        }
    }
    const config = {
        tableName: 'categories',
        timestamps: false
    }
    const Material = sequelize.define(alias, cols, config)

    return Material;
}