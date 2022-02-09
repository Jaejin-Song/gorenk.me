module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        userid: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
        },
        nickname:{
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        password:{
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        provider:{
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'local',
        },
        snsId:{
            type: DataTypes.STRING(30),
            allowNull: true,
        },
    }, {
        timestamps: true,
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    })
);