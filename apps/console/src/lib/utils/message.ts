import { toast } from 'svelte-sonner';

class CustomToast {
	duration = 2000;
	constructor() {}

	info = (msg: string) => {
		toast.info(msg, {
			duration: this.duration
		});
	};

	success = (msg: string) => {
		toast.success(msg, {
			duration: this.duration
		});
	};

	warning = (msg: string) => {
		toast.warning(msg, {
			duration: this.duration
		});
	};

	error = (msg: string) => {
		toast.error(msg, {
			duration: this.duration
		});
	};
}

const msg = new CustomToast();
export default msg;
