(function(_0x26db81,_0x1e0c98){var _0x3fb874=function(){this['MAX_ROWS']=0xe;this['MAX_COLS']=0xe;this['MIN_ROWS']=0x6;this['MIN_COLS']=0x6;this['MAX_TYPES']=0x1e;this['lineWidth']=0x3;this['Pictypes']=0xf;this['picWidth']=0x50;this['picHeight']=0x50;this['leftPadding']=0x0;this['topPadding']=0x0;this['img'];this['imgPosition'];this['totalCount']=0x0;this['moveType']=0x0;this['selectedPoint']={'row':0x0,'col':0x0};this['lastSelectPoint']={'row':0x0,'col':0x0};this['hint']=[];this['hinted']=![];this['rows']=0x0;this['cols']=0x0;this['fullMap']=new Array();this['mapCanvasID']='myCanvas';this['mapContext'];this['mapCanvas'];this['controlCanvasID']='conCanvas';this['controlContext'];this['controlCanvas'];this['lineCanvasID']='lineCanvas';this['lineContext'];this['lineCanvas'];this['success']=function(){};this['passthrough']=function(){};this['clearOne']=function(){};this['SoundCG'];this['SoundSelect'];this['SoundDisappear'];this['SoundResort'];this['SoundNoDisappear'];this['IsNeedDrawLine']=!![];this['icount']=0x0;this['score']=0x0;this['browser']={'versions':function(){var _0xfc52be=navigator['userAgent'],_0x48d1b7=navigator['appVersion'];return{'trident':_0xfc52be['indexOf']('Trident')>-0x1,'presto':_0xfc52be['indexOf']('Presto')>-0x1,'webKit':_0xfc52be['indexOf']('AppleWebKit')>-0x1,'gecko':_0xfc52be['indexOf']('Gecko')>-0x1&&_0xfc52be['indexOf']('KHTML')==-0x1,'mobile':!(_0xfc52be['indexOf']('Windows')>-0x1)&&(!!_0xfc52be['match'](/AppleWebKit.*Mobile.*/)||!!_0xfc52be['match'](/AppleWebKit/)),'ios':!!_0xfc52be['match'](/\(i[^;]+;( U;)? CPU.+Mac OS X/),'android':_0xfc52be['indexOf']('Android')>-0x1||_0xfc52be['indexOf']('Linux')>-0x1,'iPhone':_0xfc52be['indexOf']('iPhone')>-0x1||_0xfc52be['indexOf']('Mac')>-0x1,'iPad':_0xfc52be['indexOf']('iPad')>-0x1,'webApp':_0xfc52be['indexOf']('Safari')==-0x1};}()};this['checkrows']=this['browser']['versions']['mobile']?parseInt((_0x26db81['innerHeight']+0x2)/this['picHeight'])-0x2:0xa;this['checkcols']=this['browser']['versions']['mobile']?parseInt((_0x26db81['innerWidth']+0x2)/this['picWidth'])-0x2:0xe;};_0x3fb874['prototype']={'select':function(_0x3a44fe,_0xfda1a6){if(_0x3a44fe>0x0&&_0x3a44fe<=this['rows']&&_0xfda1a6>0x0&&_0xfda1a6<=this['cols']){if(this['fullMap'][_0x3a44fe][_0xfda1a6]==0x0){return;}if(this['hint']['length']>0x0){this['clearBorder'](this['controlContext'],this['hint'][0x0][0x0],this['hint'][0x0][0x1]);this['clearBorder'](this['controlContext'],this['hint'][0x1][0x0],this['hint'][0x1][0x1]);this['hint']['splice'](0x0);this['hinted']=![];}if(this['selectedPoint']['row']==0x0||this['selectedPoint']['col']==0x0){this['selectedPoint']['row']=_0x3a44fe;this['selectedPoint']['col']=_0xfda1a6;this['drawBorder'](this['controlContext'],_0x3a44fe,_0xfda1a6,'#00ffaa');this['SoundSelect']['play']();}else{if(this['selectedPoint']['row']==_0x3a44fe&&this['selectedPoint']['col']==_0xfda1a6){this['clearBorder'](this['controlContext'],this['selectedPoint']['row'],this['selectedPoint']['col']);this['selectedPoint']['row']=0x0;this['selectedPoint']['col']=0x0;this['lastSelectPoint']['row']=0x0;this['lastSelectPoint']['col']=0x0;return;}if(this['fullMap'][this['selectedPoint']['row']][this['selectedPoint']['col']]==this['fullMap'][_0x3a44fe][_0xfda1a6]){if(this['checkRoad'](this['selectedPoint']['row'],this['selectedPoint']['col'],_0x3a44fe,_0xfda1a6)){this['clearBorder'](this['controlContext'],this['selectedPoint']['row'],this['selectedPoint']['col']);this['clearBorder'](this['controlContext'],this['lastSelectPoint']['row'],this['lastSelectPoint']['col']);this['fullMap'][this['selectedPoint']['row']][this['selectedPoint']['col']]=0x0;this['fullMap'][_0x3a44fe][_0xfda1a6]=0x0;this['SoundDisappear']['play']();this['clearOne']();this['moveMap'](_0x3a44fe,_0xfda1a6,this['selectedPoint']['row'],this['selectedPoint']['col']);this['drawMap']();this['checkGameOver']();this['selectedPoint']['row']=0x0;this['selectedPoint']['col']=0x0;this['lastSelectPoint']['row']=0x0;this['lastSelectPoint']['col']=0x0;}else{if(this['lastSelectPoint']['row']==_0x3a44fe&&this['lastSelectPoint']['col']==_0xfda1a6){this['clearBorder'](this['controlContext'],this['selectedPoint']['row'],this['selectedPoint']['col']);this['selectedPoint']['row']=_0x3a44fe;this['selectedPoint']['col']=_0xfda1a6;this['drawBorder'](this['controlContext'],_0x3a44fe,_0xfda1a6,'#00ffaa');this['lastSelectPoint']['row']=0x0;this['lastSelectPoint']['col']=0x0;}else{this['lastSelectPoint']['row']=_0x3a44fe;this['lastSelectPoint']['col']=_0xfda1a6;this['SoundNoDisappear']['play']();}}}else{this['clearBorder'](this['controlContext'],this['selectedPoint']['row'],this['selectedPoint']['col']);this['selectedPoint']['row']=_0x3a44fe;this['selectedPoint']['col']=_0xfda1a6;this['drawBorder'](this['controlContext'],_0x3a44fe,_0xfda1a6,'#00ffaa');this['SoundSelect']['play']();}}}},'checkGameOver':function(){this['totalCount']--;this['totalCount']--;if(!this['totalCount']){this['SoundCG']['play']();this['passthrough']();this['createmap'](this['rows'],this['cols']);}else{this['IsNeedDrawLine']=![];while(!this['isAlive']()){this['resort']();this['SoundResort']['play']();this['icount']=this['icount']+0x3c;}this['IsNeedDrawLine']=!![];}},'manResort':function(){this['IsNeedDrawLine']=![];this['resort']();while(!this['isAlive']()){this['resort']();this['icount']=this['icount']+0x3c;}this['IsNeedDrawLine']=!![];},'clickHint':function(){if(!this['hinted']){for(var _0x51d435=0x1;_0x51d435<=this['rows'];_0x51d435++){for(var _0x1b44a9=0x1;_0x1b44a9<=this['cols'];_0x1b44a9++){if(this['fullMap'][_0x51d435][_0x1b44a9]>0x0){if(this['isAliveOther'](_0x51d435,_0x1b44a9)){for(var _0xd85416=_0x51d435;_0xd85416<=this['rows'];_0xd85416++){for(var _0x247551=0x1;_0x247551<=this['cols'];_0x247551++){if(_0xd85416==_0x51d435&&_0x247551>_0x1b44a9||_0xd85416>_0x51d435){if(this['fullMap'][_0x51d435][_0x1b44a9]==this['fullMap'][_0xd85416][_0x247551]){if(this['checkRoad'](_0x51d435,_0x1b44a9,_0xd85416,_0x247551)){this['drawBorder'](this['controlContext'],_0x51d435,_0x1b44a9,'#00ffaa');this['drawBorder'](this['controlContext'],_0xd85416,_0x247551,'#00ffaa');this['hint']['push']([_0x51d435,_0x1b44a9]);this['hint']['push']([_0xd85416,_0x247551]);this['hinted']=!![];return;}}}}}}}}}}},'isAlive':function(){for(var _0x538b0e=0x1;_0x538b0e<=this['rows'];_0x538b0e++){for(var _0x22b718=0x1;_0x22b718<=this['cols'];_0x22b718++){if(this['fullMap'][_0x538b0e][_0x22b718]>0x0){if(this['isAliveOther'](_0x538b0e,_0x22b718))return!![];}}}return![];},'isAliveOther':function(_0x14c9ec,_0x1f3151){for(var _0x22e34b=_0x14c9ec;_0x22e34b<=this['rows'];_0x22e34b++){for(var _0x1cc52e=0x1;_0x1cc52e<=this['cols'];_0x1cc52e++){if(_0x22e34b==_0x14c9ec&&_0x1cc52e>_0x1f3151||_0x22e34b>_0x14c9ec){if(this['fullMap'][_0x14c9ec][_0x1f3151]==this['fullMap'][_0x22e34b][_0x1cc52e]){if(this['checkRoad'](_0x14c9ec,_0x1f3151,_0x22e34b,_0x1cc52e)){return!![];}}}}}return![];},'moveMap':function(_0x223b66,_0xda5359,_0x43a980,_0x2ba5cf){switch(this['moveType']){case 0x1:if(_0xda5359==_0x2ba5cf&&_0x223b66>_0x43a980){_0x2ba5cf=_0x223b66;_0x223b66=_0x43a980;_0x43a980=_0x2ba5cf;_0x2ba5cf=_0xda5359;}for(i=_0x223b66;i>0x0;i--){this['fullMap'][i][_0xda5359]=this['fullMap'][i-0x1][_0xda5359];}for(i=_0x43a980;i>0x0;i--){this['fullMap'][i][_0x2ba5cf]=this['fullMap'][i-0x1][_0x2ba5cf];}break;case 0x2:if(_0xda5359==_0x2ba5cf&&_0x223b66<_0x43a980){_0x2ba5cf=_0x223b66;_0x223b66=_0x43a980;_0x43a980=_0x2ba5cf;_0x2ba5cf=_0xda5359;}for(i=_0x223b66;i<=this['rows'];i++){this['fullMap'][i][_0xda5359]=this['fullMap'][i+0x1][_0xda5359];}for(i=_0x43a980;i<=this['rows'];i++){this['fullMap'][i][_0x2ba5cf]=this['fullMap'][i+0x1][_0x2ba5cf];}break;case 0x3:if(_0x223b66==_0x43a980&&_0xda5359<_0x2ba5cf){_0x43a980=_0xda5359;_0xda5359=_0x2ba5cf;_0x2ba5cf=_0x43a980;_0x43a980=_0x223b66;}for(i=_0xda5359;i<=this['cols'];i++){this['fullMap'][_0x223b66][i]=this['fullMap'][_0x223b66][i+0x1];}for(i=_0x2ba5cf;i<=this['cols'];i++){this['fullMap'][_0x43a980][i]=this['fullMap'][_0x43a980][i+0x1];}break;case 0x4:if(_0x223b66==_0x43a980&&_0xda5359>_0x2ba5cf){_0x43a980=_0xda5359;_0xda5359=_0x2ba5cf;_0x2ba5cf=_0x43a980;_0x43a980=_0x223b66;}for(i=_0xda5359;i>0x0;i--){this['fullMap'][_0x223b66][i]=this['fullMap'][_0x223b66][i-0x1];}for(i=_0x2ba5cf;i>0x0;i--){this['fullMap'][_0x43a980][i]=this['fullMap'][_0x43a980][i-0x1];}break;case 0x5:var _0x5b13d7=parseInt(this['rows']/0x2);var _0x2e8c62=_0x5b13d7+0x1;if(_0xda5359==_0x2ba5cf){if(_0x223b66<_0x43a980&&_0x43a980<=_0x5b13d7){_0x2ba5cf=_0x223b66;_0x223b66=_0x43a980;_0x43a980=_0x2ba5cf;_0x2ba5cf=_0xda5359;}if(_0x223b66>_0x43a980&&_0x43a980>=_0x2e8c62){_0x2ba5cf=_0x223b66;_0x223b66=_0x43a980;_0x43a980=_0x2ba5cf;_0x2ba5cf=_0xda5359;}}if(_0x223b66<=_0x5b13d7){for(i=_0x223b66;i<=_0x5b13d7;i++){this['fullMap'][i][_0xda5359]=i==_0x5b13d7?0x0:this['fullMap'][i+0x1][_0xda5359];}}else{for(i=_0x223b66;i>=_0x2e8c62;i--){this['fullMap'][i][_0xda5359]=i==_0x2e8c62?0x0:this['fullMap'][i-0x1][_0xda5359];}}if(_0x43a980<=_0x5b13d7){for(i=_0x43a980;i<=_0x5b13d7;i++){this['fullMap'][i][_0x2ba5cf]=i==_0x5b13d7?0x0:this['fullMap'][i+0x1][_0x2ba5cf];}}else{for(i=_0x43a980;i>=_0x2e8c62;i--){this['fullMap'][i][_0x2ba5cf]=i==_0x2e8c62?0x0:this['fullMap'][i-0x1][_0x2ba5cf];}}break;case 0x6:var _0x5b13d7=parseInt(this['rows']/0x2);var _0x2e8c62=_0x5b13d7+0x1;if(_0xda5359==_0x2ba5cf){if(_0x223b66>_0x43a980&&_0x223b66<=_0x5b13d7){_0x2ba5cf=_0x223b66;_0x223b66=_0x43a980;_0x43a980=_0x2ba5cf;_0x2ba5cf=_0xda5359;}if(_0x223b66<_0x43a980&&_0x223b66>=_0x2e8c62){_0x2ba5cf=_0x223b66;_0x223b66=_0x43a980;_0x43a980=_0x2ba5cf;_0x2ba5cf=_0xda5359;}}if(_0x223b66<=_0x5b13d7){for(i=_0x223b66;i>0x0;i--){this['fullMap'][i][_0xda5359]=this['fullMap'][i-0x1][_0xda5359];}}else{for(i=_0x223b66;i<=this['rows'];i++){this['fullMap'][i][_0xda5359]=this['fullMap'][i+0x1][_0xda5359];}}if(_0x43a980<=_0x5b13d7){for(i=_0x43a980;i>0x0;i--){this['fullMap'][i][_0x2ba5cf]=this['fullMap'][i-0x1][_0x2ba5cf];}}else{for(i=_0x43a980;i<=this['rows'];i++){this['fullMap'][i][_0x2ba5cf]=this['fullMap'][i+0x1][_0x2ba5cf];}}break;case 0x7:var _0x1158e3=parseInt(this['cols']/0x2);var _0x2f5451=_0x1158e3+0x1;if(_0x223b66==_0x43a980){if(_0xda5359<_0x2ba5cf&&_0x2ba5cf<=_0x1158e3){_0x43a980=_0xda5359;_0xda5359=_0x2ba5cf;_0x2ba5cf=_0x43a980;_0x43a980=_0x223b66;}if(_0xda5359>_0x2ba5cf&&_0x2ba5cf>=_0x2f5451){_0x43a980=_0xda5359;_0xda5359=_0x2ba5cf;_0x2ba5cf=_0x43a980;_0x43a980=_0x223b66;}}if(_0xda5359<=_0x1158e3){for(i=_0xda5359;i<=_0x1158e3;i++){this['fullMap'][_0x223b66][i]=i==_0x1158e3?0x0:this['fullMap'][_0x223b66][i+0x1];}}else{for(i=_0xda5359;i>=_0x2f5451;i--){this['fullMap'][_0x223b66][i]=i==_0x2f5451?0x0:this['fullMap'][_0x223b66][i-0x1];}}if(_0x2ba5cf<=_0x1158e3){for(i=_0x2ba5cf;i<=_0x1158e3;i++){this['fullMap'][_0x43a980][i]=i==_0x1158e3?0x0:this['fullMap'][_0x43a980][i+0x1];}}else{for(i=_0x2ba5cf;i>=_0x2f5451;i--){this['fullMap'][_0x43a980][i]=i==_0x2f5451?0x0:this['fullMap'][_0x43a980][i-0x1];}}break;case 0x8:var _0x1158e3=parseInt(this['cols']/0x2);var _0x2f5451=_0x1158e3+0x1;if(_0x223b66==_0x43a980){if(_0xda5359>_0x2ba5cf&&_0xda5359<=_0x1158e3){_0x43a980=_0xda5359;_0xda5359=_0x2ba5cf;_0x2ba5cf=_0x43a980;_0x43a980=_0x223b66;}if(_0xda5359<_0x2ba5cf&&_0xda5359>=_0x2f5451){_0x43a980=_0xda5359;_0xda5359=_0x2ba5cf;_0x2ba5cf=_0x43a980;_0x43a980=_0x223b66;}}if(_0xda5359<=_0x1158e3){for(i=_0xda5359;i>0x0;i--){this['fullMap'][_0x223b66][i]=this['fullMap'][_0x223b66][i-0x1];}}else{for(i=_0xda5359;i<=this['cols'];i++){this['fullMap'][_0x223b66][i]=this['fullMap'][_0x223b66][i+0x1];}}if(_0x2ba5cf<=_0x1158e3){for(i=_0x2ba5cf;i>0x0;i--){this['fullMap'][_0x43a980][i]=this['fullMap'][_0x43a980][i-0x1];}}else{for(i=_0x2ba5cf;i<=this['cols'];i++){this['fullMap'][_0x43a980][i]=this['fullMap'][_0x43a980][i+0x1];}}break;default:}},'checkRoadRow':function(_0x163813,_0x4d363f,_0x4665e5){var _0x3f5528=_0x163813<_0x4d363f?_0x163813:_0x4d363f;var _0x4863e1=_0x163813<_0x4d363f?_0x4d363f:_0x163813;for(var _0x491551=_0x3f5528+0x1;_0x491551<_0x4863e1;_0x491551++){if(this['fullMap'][_0x4665e5][_0x491551]!=0x0){return 0x1;}}return 0x0;},'checkRoadCol':function(_0x3a46af,_0x1e7a45,_0x24e00e){var _0x1e0656=_0x3a46af<_0x1e7a45?_0x3a46af:_0x1e7a45;var _0x46b09b=_0x3a46af<_0x1e7a45?_0x1e7a45:_0x3a46af;for(var _0x79a819=_0x1e0656+0x1;_0x79a819<_0x46b09b;_0x79a819++){if(this['fullMap'][_0x79a819][_0x24e00e]!=0x0){return 0x1;}}return 0x0;},'checkRoad':function(_0x58ab2f,_0x1c18a6,_0x44e9c3,_0x424383){var _0x578b6e=0x0;if(Math['abs'](_0x58ab2f-_0x44e9c3)+Math['abs'](_0x1c18a6-_0x424383)==0x1){this['drawLine'](this['lineContext'],_0x58ab2f,_0x1c18a6,_0x44e9c3,_0x424383);return 0x1;}if(Math['abs'](_0x58ab2f-_0x44e9c3)==0x1&&Math['abs'](_0x1c18a6-_0x424383)==0x1){if(this['fullMap'][_0x58ab2f][_0x424383]==0x0||this['fullMap'][_0x44e9c3][_0x1c18a6]==0x0){if(this['fullMap'][_0x58ab2f][_0x424383]==0x0){this['drawLine'](this['lineContext'],_0x58ab2f,_0x1c18a6,_0x58ab2f,_0x424383);this['drawLine'](this['lineContext'],_0x58ab2f,_0x424383,_0x44e9c3,_0x424383);}else{if(this['fullMap'][_0x44e9c3][_0x1c18a6]==0x0){this['drawLine'](this['lineContext'],_0x58ab2f,_0x1c18a6,_0x44e9c3,_0x1c18a6);this['drawLine'](this['lineContext'],_0x44e9c3,_0x1c18a6,_0x44e9c3,_0x424383);}}return 0x1;}else{return 0x0;}}for(i=Math['max'](_0x58ab2f,_0x44e9c3);i>=0x0;i--){_0x578b6e=0x0;if(_0x1c18a6==_0x424383){break;}if((this['fullMap'][i][_0x1c18a6]==0x0||i==_0x58ab2f)&&(i==_0x44e9c3||this['fullMap'][i][_0x424383]==0x0)){_0x578b6e=_0x578b6e+this['checkRoadCol'](_0x58ab2f,i,_0x1c18a6);_0x578b6e=_0x578b6e+this['checkRoadRow'](_0x1c18a6,_0x424383,i);_0x578b6e=_0x578b6e+this['checkRoadCol'](i,_0x44e9c3,_0x424383);}else{_0x578b6e=0x1;}if(!_0x578b6e){this['drawLine'](this['lineContext'],_0x58ab2f,_0x1c18a6,i,_0x1c18a6);this['drawLine'](this['lineContext'],i,_0x1c18a6,i,_0x424383);this['drawLine'](this['lineContext'],i,_0x424383,_0x44e9c3,_0x424383);return 0x1;}}for(i=Math['max'](_0x58ab2f,_0x44e9c3)+0x1;i<this['rows']+0x2;i++){_0x578b6e=0x0;if(_0x1c18a6==_0x424383){break;}if((this['fullMap'][i][_0x1c18a6]==0x0||i==_0x58ab2f)&&(i==_0x44e9c3||this['fullMap'][i][_0x424383]==0x0)){_0x578b6e=_0x578b6e+this['checkRoadCol'](_0x58ab2f,i,_0x1c18a6);_0x578b6e=_0x578b6e+this['checkRoadRow'](_0x1c18a6,_0x424383,i);_0x578b6e=_0x578b6e+this['checkRoadCol'](i,_0x44e9c3,_0x424383);}else{_0x578b6e=0x1;}if(!_0x578b6e){this['drawLine'](this['lineContext'],_0x58ab2f,_0x1c18a6,i,_0x1c18a6);this['drawLine'](this['lineContext'],i,_0x1c18a6,i,_0x424383);this['drawLine'](this['lineContext'],i,_0x424383,_0x44e9c3,_0x424383);return 0x1;}}for(j=Math['max'](_0x1c18a6,_0x424383);j>=0x0;j--){_0x578b6e=0x0;if(_0x58ab2f==_0x44e9c3){break;}if((j==_0x1c18a6||this['fullMap'][_0x58ab2f][j]==0x0)&&(j==_0x424383||this['fullMap'][_0x44e9c3][j]==0x0)){_0x578b6e=_0x578b6e+this['checkRoadRow'](_0x1c18a6,j,_0x58ab2f);_0x578b6e=_0x578b6e+this['checkRoadCol'](_0x58ab2f,_0x44e9c3,j);_0x578b6e=_0x578b6e+this['checkRoadRow'](j,_0x424383,_0x44e9c3);}else{_0x578b6e++;}if(!_0x578b6e){this['drawLine'](this['lineContext'],_0x58ab2f,_0x1c18a6,_0x58ab2f,j);this['drawLine'](this['lineContext'],_0x58ab2f,j,_0x44e9c3,j);this['drawLine'](this['lineContext'],_0x44e9c3,j,_0x44e9c3,_0x424383);return 0x1;}}for(j=Math['max'](_0x1c18a6,_0x424383)+0x1;j<this['cols']+0x2;j++){_0x578b6e=0x0;if(_0x58ab2f==_0x44e9c3){break;}if((j==_0x1c18a6||this['fullMap'][_0x58ab2f][j]==0x0)&&(j==_0x424383||this['fullMap'][_0x44e9c3][j]==0x0)){_0x578b6e=_0x578b6e+this['checkRoadRow'](_0x1c18a6,j,_0x58ab2f);_0x578b6e=_0x578b6e+this['checkRoadCol'](_0x58ab2f,_0x44e9c3,j);_0x578b6e=_0x578b6e+this['checkRoadRow'](j,_0x424383,_0x44e9c3);}else{_0x578b6e++;}if(!_0x578b6e){this['drawLine'](this['lineContext'],_0x58ab2f,_0x1c18a6,_0x58ab2f,j);this['drawLine'](this['lineContext'],_0x58ab2f,j,_0x44e9c3,j);this['drawLine'](this['lineContext'],_0x44e9c3,j,_0x44e9c3,_0x424383);return 0x1;}}return 0x0;},'initCanvas':function(){var _0x4d170e=this;this['mapCanvas']=document['getElementById'](this['mapCanvasID']);this['mapContext']=this['mapCanvas']['getContext']('2d');this['lineCanvas']=document['getElementById'](this['lineCanvasID']);this['lineContext']=this['lineCanvas']['getContext']('2d');var _0x126e6d=this['controlCanvas']=document['getElementById'](this['controlCanvasID']);this['controlContext']=this['controlCanvas']['getContext']('2d');_0x126e6d['addEventListener']('click',function(_0x31c985){var _0x3bba6e=parseInt((_0x31c985['offsetX']-_0x4d170e['leftPadding'])/_0x4d170e['picWidth']);var _0x47a6b3=parseInt((_0x31c985['offsetY']-_0x4d170e['topPadding'])/_0x4d170e['picHeight']);_0x4d170e['select'](_0x47a6b3,_0x3bba6e);},![]);var _0x2ae4c9=this['leftPadding']+this['picWidth']*(this['cols']+0x2);var _0x3ac009=this['topPadding']+this['picHeight']*(this['rows']+0x2);this['mapCanvas']['width']=this['controlCanvas']['width']=this['lineCanvas']['width']=_0x2ae4c9;this['mapCanvas']['height']=this['controlCanvas']['height']=this['lineCanvas']['height']=_0x3ac009;},'clearBorder':function(_0x173866,_0x5a511c,_0x31dcd0){_0x173866['clearRect'](_0x31dcd0*this['picWidth']+this['leftPadding']+0x4,_0x5a511c*this['picHeight']+this['topPadding']-0x1,this['picWidth'],this['picHeight']);},'drawLine':function(_0x1829d6,_0x21d17e,_0x5741c6,_0x28afab,_0x52a0fe){if(!this['IsNeedDrawLine'])return;var _0x362978=_0x5741c6*this['picWidth']+this['leftPadding']+this['picWidth']/0x2;var _0x1b4c8e=_0x52a0fe*this['picWidth']+this['leftPadding']+this['picWidth']/0x2;var _0x211dbc=_0x21d17e*this['picHeight']+this['topPadding']+this['picHeight']/0x2;var _0x1f6cf8=_0x28afab*this['picHeight']+this['topPadding']+this['picHeight']/0x2;_0x1829d6['beginPath']();_0x1829d6['strokeStyle']='#ff0000';_0x1829d6['lineWidth']=this['lineWidth'];_0x1829d6['moveTo'](_0x362978,_0x211dbc);_0x1829d6['lineTo'](_0x1b4c8e,_0x1f6cf8);_0x1829d6['stroke']();_0x1829d6['closePath']();},'drawBorder':function(_0x381fc0,_0x7ac1b5,_0x5bdc55,_0x421715){_0x381fc0['beginPath']();_0x381fc0['rect'](_0x5bdc55*this['picWidth']+this['leftPadding']+0x5,_0x7ac1b5*this['picHeight']+this['topPadding'],this['picWidth']-0x2,this['picHeight']-0x2);_0x381fc0['lineWidth']=0x1;_0x381fc0['globalAlpha']=0.4;_0x381fc0['fillStyle']=_0x421715;_0x381fc0['strokeStyle']=_0x421715;_0x381fc0['fill']();_0x381fc0['stroke']();_0x381fc0['closePath']();},'drawBox':function(_0x2f4f89,_0x4819c4,_0x4a70a9,_0x5ce22b){_0x2f4f89['beginPath']();_0x2f4f89['rect'](_0x4a70a9*this['picWidth']+this['leftPadding'],_0x4819c4*this['picHeight']+this['topPadding'],this['picWidth'],this['picHeight']);_0x2f4f89['lineWidth']=0x1;_0x2f4f89['strokeStyle']='rgba(255,255,255,0)';_0x2f4f89['fillStyle']='rgba(255,255,255,0)';_0x2f4f89['fill']();_0x2f4f89['stroke']();_0x2f4f89['closePath']();if(_0x5ce22b){_0x2f4f89['drawImage'](this['img'],0x0,this['imgPosition'][_0x5ce22b],0x78,0x78,_0x4a70a9*this['picWidth']+0x5+this['leftPadding'],_0x4819c4*this['picHeight']+this['topPadding'],this['picWidth'],this['picHeight']);}else{this['clearBorder'](_0x2f4f89,_0x4819c4,_0x4a70a9);}},'drawMap':function(){for(i=0x0;i<this['rows']+0x2;i++){for(j=0x0;j<this['cols']+0x2;j++){if(i>=0x0&&i<=this['rows']+0x1&&j>=0x0&&j<=this['cols']+0x1){this['drawBox'](this['mapContext'],i,j,this['fullMap'][i][j]);}}}},'randomsort':function(_0x5a57fe,_0x3261c1){return Math['random']()>0.5?-0x1:0x1;},'resort':function(){var _0x122db9=[];for(i=0x1;i<this['rows']+0x1;i++){for(j=0x1;j<this['cols']+0x1;j++){if(this['fullMap'][i][j]>0x0){_0x122db9[_0x122db9['length']]=this['fullMap'][i][j];}}}_0x122db9['sort'](this['randomsort']);for(i=0x1;i<this['rows']+0x1;i++){for(j=0x1;j<this['cols']+0x1;j++){if(this['fullMap'][i][j]>0x0){this['fullMap'][i][j]=_0x122db9[0x0];_0x122db9['splice'](0x0,0x1);}}}this['drawMap']();},'createmap':function(_0x3fcaba,_0x307ce9){this['picTypes']=parseInt(_0x3fcaba*_0x307ce9/0x2);this['picTypes']=this['picTypes']>this['MAX_TYPES']?this['MAX_TYPES']:this['picTypes'];this['rows']=Math['min'](_0x3fcaba,this['MAX_ROWS']);this['cols']=Math['min'](_0x307ce9,this['MAX_COLS']);this['leftPadding']=($('#gameContainer')['width']()-(this['cols']+0x2)*this['picWidth'])/0x2;this['topPadding']=($('#gameContainer')['height']()-0x78-(this['rows']+0x3)*this['picHeight'])/0x2;this['totalCount']=this['rows']*this['cols'];var _0x1eb65d=[];for(var _0x1d26b2=0x1;_0x1d26b2<=this['rows']*this['cols']/0x2;_0x1d26b2++){var _0x38754e=parseInt(Math['random']()*this['picTypes']+0x1);_0x1eb65d[_0x1eb65d['length']]=_0x1eb65d[_0x1eb65d['length']+0x1]=_0x38754e;}var _0x2f13e1=new Array();for(_0x1d26b2=0x0;_0x1d26b2<this['rows']+0x2;_0x1d26b2++){_0x2f13e1[_0x1d26b2]=new Array();for(j=0x0;j<this['cols']+0x2;j++){if(_0x1d26b2>0x0&&_0x1d26b2<this['rows']+0x1&&j>0x0&&j<this['cols']+0x1){var _0x59ca87=parseInt(Math['random']()*_0x1eb65d['length']);_0x2f13e1[_0x1d26b2][j]=_0x1eb65d[_0x59ca87];_0x1eb65d['splice'](_0x59ca87,0x1);}else{_0x2f13e1[_0x1d26b2][j]=0x0;}}}this['fullMap']=_0x2f13e1;}};_0x26db81['MahjongConnect']=_0x3fb874;}(window));