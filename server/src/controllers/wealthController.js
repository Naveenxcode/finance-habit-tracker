const Asset = require('../models/Asset');
const Liability = require('../models/Liability');
const NetworthSnapshot = require('../models/NetworthSnapshot');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.addAsset = asyncHandler(async (req, res) => {
  req.body.userId = req.user._id;
  const asset = await Asset.create(req.body);
  res.status(201).json({ success: true, data: asset });
});

exports.getAssets = asyncHandler(async (req, res) => {
  const assets = await Asset.find({ userId: req.user._id }).sort('-currentValue');
  res.json({ success: true, count: assets.length, data: assets });
});

exports.updateAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id }, req.body, { new: true }
  );
  if (!asset) throw new ApiError(404, 'Asset not found');
  res.json({ success: true, data: asset });
});

exports.deleteAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!asset) throw new ApiError(404, 'Asset not found');
  res.json({ success: true, message: 'Asset deleted' });
});

exports.addLiability = asyncHandler(async (req, res) => {
  req.body.userId = req.user._id;
  const liability = await Liability.create(req.body);
  res.status(201).json({ success: true, data: liability });
});

exports.getLiabilities = asyncHandler(async (req, res) => {
  const liabilities = await Liability.find({ userId: req.user._id }).sort('-remainingAmount');
  res.json({ success: true, count: liabilities.length, data: liabilities });
});

exports.updateLiability = asyncHandler(async (req, res) => {
  const liability = await Liability.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id }, req.body, { new: true }
  );
  if (!liability) throw new ApiError(404, 'Liability not found');
  res.json({ success: true, data: liability });
});

exports.deleteLiability = asyncHandler(async (req, res) => {
  const liability = await Liability.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!liability) throw new ApiError(404, 'Liability not found');
  res.json({ success: true, message: 'Liability deleted' });
});

exports.getNetWorthSummary = asyncHandler(async (req, res) => {
  const assets = await Asset.find({ userId: req.user._id });
  const liabilities = await Liability.find({ userId: req.user._id, status: 'active' });

  const totalAssets = assets.reduce((sum, a) => sum + a.currentValue, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.remainingAmount, 0);
  const netWorth = totalAssets - totalLiabilities;

  res.json({
    success: true,
    data: {
      totalAssets,
      totalLiabilities,
      netWorth,
      assets,
      liabilities
    }
  });
});

exports.getSnapshots = asyncHandler(async (req, res) => {
  const snapshots = await NetworthSnapshot.find({ userId: req.user._id }).sort({ year: 1, month: 1 });
  res.json({ success: true, count: snapshots.length, data: snapshots });
});
