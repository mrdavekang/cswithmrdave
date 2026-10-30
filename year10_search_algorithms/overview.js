/* Opening-film configuration and small, testable flow rules. No pupil data. */
(function(root){'use strict';
 const duration=193.1648125,seconds=Math.ceil(duration),source='y10-search-overview';
 function afterSetup(state,armedRun,remaining){return !!armedRun&&state?.stage_id==='settle'&&state.phase==='work'&&state.stage_run_id===armedRun&&remaining<=0;}
 function trusted(event,board,origin,run){return !!board&&event.source===board&&event.origin===origin&&event.data?.source===source&&event.data.runId===run&&['playing','paused','waiting','blocked','ended','error'].includes(event.data.type);}
 const api={duration,seconds,source,video:'media/Searching_Lesson_Overview.mp4',poster:'media/search-overview-poster.jpg',afterSetup,trusted};root.SearchOverview=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
