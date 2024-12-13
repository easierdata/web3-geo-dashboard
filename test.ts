import axios from 'axios';

const root_stac_url = 'http://ec2-54-172-212-55.compute-1.amazonaws.com/api/v1/pgstac';

async function main(): Promise<void> {
	const collections = await axios.get(`${root_stac_url}/collections`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});

	console.log(collections.data);
}

main();
