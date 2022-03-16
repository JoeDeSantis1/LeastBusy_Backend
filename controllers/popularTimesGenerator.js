// I'm ranking busy-ness from 1-100.
// I don't know how google does it but ranking them this way will make it easy to sort restaurants for a particular time.
// Each hour represents the predicted busy-ness over the whole hour. For the purposes of the demo this is fine.
// For actual Google data (or guesses based on Facebook check-ins) I will break it down more accurately. 
// When ('if') google makes this information available via their API I will rework any logic to accomodate for however the infomation
// is given. Same for if I need to use Check-in data from Facebook's API 

const fillHours = (hours, busyTimeOfDay, slowTimeOfDay) => {
    let dayNumber = 0;

    const dayArray = [['sun', 0], ['mon', 0], ['tue', 0], ['wed', 0], ['thu', 0], ['fri', 0], ['sat', 0]];

    const days = {
        sun: {
            open: true,
            closesNextDay: false,
            openHour: 0,
            closeHour: 0, 
        }, 
        mon: {
            open: true,
            closesNextDay: false,
            openHour: 0,
            closeHour: 0
        },
        tue: {
            open: true,
            closesNextDay: false,
            openHour: 0,
            closeHour: 0
        }, 
        wed: {
            open: true,
            closesNextDay: false,
            openHour: 0,
            closeHour: 0
        }, 
        thu: {
            open: true,
            closesNextDay: false,
            openHour: 0,
            closeHour: 0
        }, 
        fri: {
            open: false,
            closesNextDay: false,
            openHour: 0,
            closeHour: 0
        }, 
        sat: {
            open: false,
            closesNextDay: false,
            openHour: 0,
            closeHour: 0
        }, 
    };

    if(is24Hour(hours)) {
        dayArray.forEach(el => {
            const day = el[0];

            days[day].open = true;
            days[day].openHour = 1;
            days[day].closeHour = 24;
        })
    } else {
        hours.periods.forEach(el => {
            const dayNum = el.open.day;
    
            const day = dayArray[dayNum][0];
    
            days[day].open = true;
            days[day].openHour = el.open.time.slice(0, 2);
            checkForMidnight(el.close.time) ? days[day].closeHour = 24 : days[day].closeHour = el.close.time.slice(0, 2);
            if(el.open.time > el.close.time) {
                days[day].closesNextDay = true;
            }
    
            dayArray[dayNum][1] = 1;
        })

        dayArray.forEach(el => {
            if(el[1] === 0) {
                days[el[0]].open = false
            }
        })
    }
    
    for (const [key, value] of Object.entries(days)) {
        if(value.open) {
            const day = key;

            if(value.closesNextDay) {
                for (const [skey, value] of Object.entries(popularTimes[day])) {
                    const key = Number.parseInt(skey);
            
                    if((key >= days[day].openHour && key <= 24) || (key >= 1 && key <= days[day].closeHour)) {
                        
                        if(busyTimeOfDay === 'breakfast' && (key >= 6 && key <= 11)) { 

                            const popularity = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
                        
                            popularTimes[day][key] = popularity;

                        } else if (busyTimeOfDay === 'lunch' && (key >= 12 && key <= 15)) {
                                
                            const popularity = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
                        
                            popularTimes[day][key] = popularity;

                        } else if (busyTimeOfDay === 'dinner' && (key >= 17 && key <= 21)) {

                            const popularity = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
                        
                            popularTimes[day][key] = popularity;

                        } else if (slowTimeOfDay === 'breakfast' && (key >= 6 && key <= 11)) {

                            const popularity = Math.floor(Math.random() * 10) + 1;
                        
                            popularTimes[day][key] = popularity;

                        } else if (slowTimeOfDay === 'lunch' && (key >= 12 && key <= 15)) {

                            const popularity = Math.floor(Math.random() * 10) + 1;
                        
                            popularTimes[day][key] = popularity;

                        } else if (slowTimeOfDay === 'dinner' && (key >= 17 && key <= 21)) {

                            const popularity = Math.floor(Math.random() * 10) + 1;
                        
                            popularTimes[day][key] = popularity;

                        } else if (key >= 1 && key <= days[day].closeHour) {
                            
                            const popularity = Math.floor(Math.random() * 10) + 1;

                            const newDay = day === 'sat' ? 'sun' : dayArray[dayNumber+1][0];
                            
                            popularTimes[newDay][key] = popularity;

                        } else {
                            const popularity = Math.floor(Math.random() * (60 - 10 + 1)) + 1;
                        
                            popularTimes[day][key] = popularity;
                        }
                    }
                }
            } else {
                for (const [skey, value] of Object.entries(popularTimes[day])) {
                    const key = Number.parseInt(skey);
            
                    if(key >= days[day].openHour && key <= days[day].closeHour) {
                        
                        if(busyTimeOfDay === 'breakfast' && (key >= 6 && key <= 11)) { 

                            const popularity = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
                        
                            popularTimes[day][key] = popularity;

                        } else if (busyTimeOfDay === 'lunch' && (key >= 12 && key <= 15)) {
                                
                            const popularity = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
                        
                            popularTimes[day][key] = popularity;

                        } else if (busyTimeOfDay === 'dinner' && (key >= 17 && key <= 21)) {

                            const popularity = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
                        
                            popularTimes[day][key] = popularity;

                        } else if (slowTimeOfDay === 'breakfast' && (key >= 6 && key <= 11)) {

                            const popularity = Math.floor(Math.random() * 10) + 1;
                        
                            popularTimes[day][key] = popularity;

                        } else if (slowTimeOfDay === 'lunch' && (key >= 12 && key <= 15)) {

                            const popularity = Math.floor(Math.random() * 10) + 1;
                        
                            popularTimes[day][key] = popularity;

                        } else if (slowTimeOfDay === 'dinner' && (key >= 17 && key <= 21)) {

                            const popularity = Math.floor(Math.random() * 10) + 1;
                        
                            popularTimes[day][key] = popularity;

                        } else {
                            const popularity = Math.floor(Math.random() * (60 - 10 + 1)) + 1;
                        
                            popularTimes[day][key] = popularity;
                        }
                    }
                }
            }
        }    

        dayNumber++;
    }

    return popularTimes;
 
}

const is24Hour = (hours) => {
    const weekday_text = hours.weekday_text[0];

    if(weekday_text.includes('Open 24 hours')) {
        return true;
    } else {
        return false;
    }
}

const checkForMidnight = (time) => {
    return time === '0000' ? true : false; 
}


let popularTimes = {    
    sun: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0},
    mon: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0},
    tue: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0},
    wed: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0},
    thu: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0},
    fri: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0},
    sat: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0}
};

module.exports = { fillHours };