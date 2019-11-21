<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

//Begin: Rute za info u dashboard-u kao i za upload iz dasboard-a.
Route::get('/dashboard', 'DashboardController@dashboard');
Route::post('/dashboardInfo', 'DashboardController@ajaxInfo');
//End: Rute za info u dashboard-u kao i za upload iz dasboard-a.

//Begin: Rute za info u dashboard-u.
Route::post('/infoAjax','DashboardController@ajaxInfo');
//End: Rute za info u dashboard-u.

//Begin: Rute za upload videa.
Route::get('/create','VideoController@create');
Route::post('/upload','VideoController@store');
//End: Rute za upload videa.

//Begin: Rute za listing videa.
Route::get('/list','VideoController@list');
Route::post('/listData','VideoController@index');
//End: Rute za listing videa.

//Begin: Rute za show videa.
Route::get('/list/{id}', 'VideoController@show');
Route::post('/showAjax','VideoController@ajaxShow');
//End: Rute za show videa.

//Begin: Rute za update videa.
Route::post('/uploadUpdate/{id}','VideoController@ajaxUpdate');
//End: Rute za update videa.

//Begin: Rute za delete videa.
Route::post('/deleteAjax/{id}','VideoController@ajaxDestroy');
//End: Rute za delete videa.

//Begin: Rute za dodavanje titlova.
Route::get('/addSub','VideoController@addSub');
Route::post('/addSubAjax','VideoController@addSubAjax');

Route::post('/addSubToVideo','VideoController@addSubToVideo');
//End: Rute za dodavanje titlova.

//Begin: Rute za modifikaciju titlova.
Route::get('/modSub','VideoController@modSub');

Route::post('/modSubOfVideo','VideoController@modSubOfVideo');
//End: Rute za modifikaciju titlova.

//Begin: Rute za open titlova.

Route::post('/openSubOfVideo','VideoController@openSubOfVideo');
//End: Rute za open titlova.

//Begin: Rute za write titlova.

Route::post('/writeSubOfVideo','VideoController@writeSubOfVideo');
//End: Rute za write titlova.