import Address from "../models/Address.js";

export const createAddress = async (req, res) => {
  const {
    name,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    isDefault,
  } = req.body;

  if (
    !name ||
    !phone ||
    !addressLine1 ||
    !city ||
    !state ||
    !postalCode
  ) {
    return res.status(400).json({
      success: false,
      message: "Required address fields are missing",
    });
  }

  if (isDefault) {
    await Address.updateMany(
      { user: req.user._id },
      { $set: { isDefault: false } }
    );
  }

  const existingAddressCount = await Address.countDocuments({
    user: req.user._id,
  });

  const address = await Address.create({
    user: req.user._id,
    name,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country: country || "India",
    isDefault: isDefault || existingAddressCount === 0,
  });

  return res.status(201).json({
    success: true,
    message: "Address created successfully",
    data: {
      address,
    },
  });
};

export const getMyAddresses = async (req, res) => {
  const addresses = await Address.find({
    user: req.user._id,
  }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  return res.status(200).json({
    success: true,
    data: {
      addresses,
    },
  });
};

export const getAddressById = async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    return res.status(404).json({
      success: false,
      message: "Address not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      address,
    },
  });
};

export const updateAddress = async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    return res.status(404).json({
      success: false,
      message: "Address not found",
    });
  }

  const {
    name,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    isDefault,
  } = req.body;

  if (isDefault) {
    await Address.updateMany(
      {
        user: req.user._id,
        _id: { $ne: address._id },
      },
      {
        $set: {
          isDefault: false,
        },
      }
    );
  }

  if (name !== undefined) address.name = name;
  if (phone !== undefined) address.phone = phone;
  if (addressLine1 !== undefined) {
    address.addressLine1 = addressLine1;
  }
  if (addressLine2 !== undefined) {
    address.addressLine2 = addressLine2;
  }
  if (city !== undefined) address.city = city;
  if (state !== undefined) address.state = state;
  if (postalCode !== undefined) {
    address.postalCode = postalCode;
  }
  if (country !== undefined) address.country = country;
  if (isDefault !== undefined) {
    address.isDefault = isDefault;
  }

  await address.save();

  return res.status(200).json({
    success: true,
    message: "Address updated successfully",
    data: {
      address,
    },
  });
};

export const deleteAddress = async (req, res) => {
  const address = await Address.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    return res.status(404).json({
      success: false,
      message: "Address not found",
    });
  }

  if (address.isDefault) {
    const nextAddress = await Address.findOne({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    if (nextAddress) {
      nextAddress.isDefault = true;
      await nextAddress.save();
    }
  }

  return res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
};

export const setDefaultAddress = async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    return res.status(404).json({
      success: false,
      message: "Address not found",
    });
  }

  await Address.updateMany(
    {
      user: req.user._id,
      _id: { $ne: address._id },
    },
    {
      $set: {
        isDefault: false,
      },
    }
  );

  address.isDefault = true;

  await address.save();

  return res.status(200).json({
    success: true,
    message: "Default address updated successfully",
    data: {
      address,
    },
  });
};