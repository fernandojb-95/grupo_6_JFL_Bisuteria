module.exports = (sequelize, dataTypes) => {
    const alias = 'User';
    const cols = {
        id: {
            type: dataTypes.INTEGER,
            allowNull: false,
            autoincrement: true,
            primaryKey: true,
            unique: true
            
        },
        first_name: {
            type: dataTypes.STRING(100),
            allowNull: false
        },
        last_name: {
            type: dataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: dataTypes.STRING(100),
            allowNull: false      
        },
        password: {
            type: dataTypes.STRING(200),
            allowNull: false      
        },
        isAdmin: {
            type: dataTypes.BOOLEAN,
            allowNull: false      
        },
        image: {
            type: dataTypes.STRING(100),
            allowNull: true,
            defaultValue: "default-user.png"
        }
    }
    const config = {
        tableName: 'users',
        timestamps: false
    }
    const User = sequelize.define(alias, cols, config)

    return User;
}