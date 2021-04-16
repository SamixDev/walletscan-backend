exports.successResponse = function (res, msg) {
	var data = {
		status: 1,
		message: msg
	};
	return res.status(200).json(data);
};

exports.successResponseTransactions = function (res, total_tx,total_fee,total_in ,total_out , msg) {
	var data = {
		status: 1,
		total_tx: total_tx,
		total_fee: total_fee,
		total_in: total_in,
		total_out: total_out,
		message: msg
	};
	return res.status(200).json(data);
};

exports.failResponseTransactions = function (res , msg) {
	var data = {
		status: 0,
		total_tx: 0,
		total_fee: 0,
		total_in: 0,
		total_out: 0,
		message: msg
	};
	return res.status(200).json(data);
};

exports.errResponse = function (res, msg) {
	var data = {
		status: 0,
		message: msg
	};
	return res.status(200).json(data);
};

exports.successResponseWithData = function (res, msg, data) {
	var resData = {
		status: 1,
		message: msg,
		data: data
	};
	return res.status(200).json(resData);
};

exports.ErrorResponse = function (res, msg) {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(500).json(data);
};

exports.notFoundResponse = function (res, msg) {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(404).json(data);
};

exports.validationErrorWithData = function (res, msg, data) {
	var resData = {
		status: 0,
		message: msg,
		data: data
	};
	return res.status(400).json(resData);
};

exports.unauthorizedResponse = function (res, msg) {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(401).json(data);
};
