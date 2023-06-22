/* 
    @param: previous is expected to be formated as YYYY-MM-DD HH-MM-SS or other valid format as argument to function Date.parse()
*/
export const makeTimeRelative = (previous: string): string => {
    // Webkit parses date different from other browsers. Inject
    // a T-token and it seems that we have a portable behaviour
    const splitDate = previous.split(' ');
    const injectedDate = splitDate.length === 2 ? splitDate[0] + "T" + splitDate[1] : previous;
    const parsedPreviousTime = Date.parse(injectedDate)
    if (!isNaN(parsedPreviousTime)) {
        const currentTime = Date.now();
        const msPerMinute = 60 * 1000;
        const msPerHour = msPerMinute * 60;
        const relTimeBreakPoint = msPerHour * 8;

        const elapsedTime = currentTime - parsedPreviousTime;

        if (elapsedTime < msPerMinute) {
            return 'less than a minute';
        }

        else if (elapsedTime < msPerHour) {
            const minutes = Math.floor(elapsedTime / msPerMinute);
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
        }

        else if (elapsedTime < relTimeBreakPoint) {
            const inTotalMinutes = elapsedTime / msPerMinute;
            const hours = Math.floor(inTotalMinutes / 60);
            const minutes = Math.floor(inTotalMinutes % 60);
            return `${hours} ${hours === 1 ? 'hour' : 'hours'} and ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
        }

    }
    return previous; // YYYY-MM-DD HH-MM-SS format if time gone since request > 8h

}