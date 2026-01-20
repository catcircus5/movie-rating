module.exports = function(req, res, next){
  if (!req.user) return res.status(401).send('Not authenticated');
  if (req.user.role !== 'admin') return res.status(403).send('Admin only');
  next();
};
