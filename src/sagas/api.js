let url = 'http://localhost:8889';

let requestInfo = {
	method:'POST', 
	headers: {
		'Content-Type': 'application/json'
	}
};

export function send(path, paramObj){
	return fetch(`${url}/${path}`, 
		{ 
			...requestInfo,
			body: JSON.stringify(paramObj)
		}).then(resp=>resp.json());
}
export default {
	signup: function(username, password, email){
		return fetch(`${url}/signup`, 
			{ 
				...requestInfo,
				body: JSON.stringify({username, password, email})
			}).then(resp=>resp.json());

	},
	login: function(username, password){
		return fetch(`${url}/login`, 
			{ 
				...requestInfo,
				body: JSON.stringify({username, password})
			}).then(resp=>resp.json());

	},
	resendConfirmEmail: function(username){
		return fetch(`${url}/resend`, 
			{ 
				...requestInfo,
				body: JSON.stringify({username})
			}).then(resp=>resp.json());

	}

};
