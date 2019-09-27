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

Route::post('/uploadUpdate/{id}','VideoController@ajaxUpdate');

Route::post('/deleteAjax/{id}','VideoController@ajaxDestroy');