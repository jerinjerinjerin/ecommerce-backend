import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db/index";

export class User extends Model {
  public id!: number;
  public username!: string;
  public profileUrl?: string;
  public email!: string;
  public password!: string;
  public isAuthenticated!: boolean;
  public otp?: string;
  public otpExpiredAt?: Date;
  public createdAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true, // Mark id as the primary key
      defaultValue: DataTypes.UUIDV4, // Automatically generate
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAuthenticated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    otpExpiredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    profileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXJr-fGkiy1DE5A0JNOkcmCNGcXuQXdzENZA&s",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "User",
  },
);
