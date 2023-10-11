export default class Time {

    public static async wait(ms: number) {

        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms);
        });

    }

}