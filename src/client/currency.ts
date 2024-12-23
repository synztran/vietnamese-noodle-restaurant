import dotenv from "dotenv";
dotenv.config();
const PATH = {
	CURRENCY_EXCHANGE: "http://api.exchangeratesapi.io/v1/latest",
	CONVERT: "http://api.exchangeratesapi.io/v1/convert",
};

interface IResp {
	status: number;
	json: () => any;
}

export default async function GetCurrencyRate() {
	try {
		return fetch(
			`${PATH.CURRENCY_EXCHANGE}?access_key=${process.env.CURRENCY_API_KEY}&symbols=VND`
		)
			.then((res: IResp) => res.json())
			.catch((error) => {
				console.error(error);
			});
	} catch (error) {
		console.error(error);
	}
}
