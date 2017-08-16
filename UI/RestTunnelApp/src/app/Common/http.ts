export const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded; charset=utf-8';
const HOST_URL = 'http://mfoglight.azurewebsites.net';
// const HOST_URL = 'http://10.30.154.102:8080';

export interface HttpOptions {
	headers?: any;
}

export interface Response {
	ok: boolean;
	status: number;
	statusText: string;
	headers: any;
	json(): Promise<any>;
}

export function httpGet(url: string, options?: HttpOptions, contentType?: string): Promise<Response> {
	return http('GET', url, options, contentType);
}

export function httpPost(url: string, contentType: string, body: any,
		options?: HttpOptions): Promise<Response> {
	return http('POST', url, options, contentType, body);
}

export function httpPut(url: string, contentType: string, body: any,
		options?: HttpOptions): Promise<Response> {
	return http('PUT', url, options, contentType, body);
}

export function httpDelete(url: string, options?: HttpOptions): Promise<Response> {
	return http('DELETE', url, options);
}

export class HttpError extends Error {
	response: Response;

	constructor(message: string, response: Response) {
		super(message);
		this.response = response;
	}
}

export function extractJSON(response: Response): Promise<any> {
	let status = response.status;
	return status === 200 ? response.json() :
			Promise.reject(new HttpError('Unexpected status: ' + status + ' ' +
					response.statusText, response));
}

var pending: Array<any>;

declare function fetch(url: string, options: any): Promise<Response>;
declare class Headers {
	set(name: string, value: string): void;
}

var http: Function = (<any> window).fetch ?
	function(method: string, url: string, options?: HttpOptions, contentType?: string, body?: any): Promise<Response> {
		let headers = new Headers();

		if (options) {
			let hdrOpt = options.headers;
			if (hdrOpt) {
				Object.keys(hdrOpt).forEach(name =>
					headers.set(name, hdrOpt[name]));
			}
		}
		if (contentType) {
			headers.set('Content-Type', contentType)
		}
		let token = localStorage['authToken'];
		if (token) {
			headers.set('Auth-Token', token);
    }

    let accessCode = localStorage['accessCode'];
		if (accessCode) {
			headers.set('access-key', accessCode);
    }

    url = HOST_URL + url;
		return fetch(url, {method, headers, body})
			.then(response => {
				if (response.status != 401) {
					return response;
				}

				return new Promise((resolve, reject) =>
						handleUnauthorized(resolve, reject,
								[method, url, options, contentType, body]));
			})
	}
	:
	function(method: string, url: string, options?: HttpOptions, contentType?: string, body?: any): Promise<Response> {
		class XHRHeaders {
			constructor(private xhr: XMLHttpRequest) {}

			get(name: string) {
				return this.xhr.getResponseHeader(name);
			}
		}

		class XHRResponse implements Response {
			headers: XHRHeaders;

			constructor(private xhr: XMLHttpRequest) {
				this.headers = new XHRHeaders(xhr);
			}

			get ok() {
				let status = this.xhr.status;
				return status >= 200 && status <= 299;
			}

			get status() {
				return this.xhr.status;
			}

			get statusText() {
				return this.xhr.statusText;
			}

			json() {
				return Promise.resolve(JSON.parse(this.xhr.responseText));
			}
		}

		return new Promise((resolve, reject) => {
			let r = new XMLHttpRequest();
			r.open(method, url, true);
			r.onreadystatechange = () => {
				if (r.readyState == 4) {
					r.onreadystatechange = null;
					let status = r.status;
					if (status == 401) {
						handleUnauthorized(resolve, reject,
								[method, url, options, contentType, body]);
					}
					else {
						resolve(new XHRResponse(r));
					}
				}
			};

			if (options) {
				let headers = options.headers;
				if (headers) {
					Object.keys(headers).forEach(name =>
						r.setRequestHeader(name, headers[name]));
				}
			}
			if (contentType) {
				r.setRequestHeader('Content-Type', contentType);
			}
			let token = localStorage['authToken'];
			if (token) {
				r.setRequestHeader('Auth-Token', token);
			}
			r.send(body);
		})
	};

function handleUnauthorized(resolve: Function, reject: Function, args: any[]): void {
	let data = {resolve, reject, args};
	if (pending) {
		pending.push(data);
	}
	else {
		pending = [data];
		window.dispatchEvent(buildCustomEvent('httpUnauthorized', {resume}));
	}
}

function buildCustomEvent(eventName: string, detail: any): CustomEvent {
	let event = document.createEvent('CustomEvent');
	event.initCustomEvent(eventName, false, false, detail);
	return event;
}

function resume(token: string): void {
	localStorage['authToken'] = token;
	let list = pending;
	pending = null;
	list.forEach(data => http.apply(null, data.args)
			.then(data.resolve, data.reject));
}
