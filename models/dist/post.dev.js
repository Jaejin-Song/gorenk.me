"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('post', {
    title: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(1500),
      allowNull: false
    },
    img: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    views: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    paranoid: true,
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
};