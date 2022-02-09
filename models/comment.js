module.exports = (sequelize, DataTypes) => (
    sequelize.define('comment', {
        comment: {
            type: DataTypes.STRING(100),
            allowNull: false,
        }
    }, {
        timestamps : true,
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    })
);