<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Videos;
use Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;

class DashboardController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */

    public function dashboard()
    {
        return view('dashboard');
    }

    public function ajaxInfo(Request $request){    

        if($request->ajax()){

            $users = User::all();
            $user = auth()->user();

            $response = array(
                "permission" => $user->isAdmin(),
                "users" => $users,
                "user" => $user,
                "request" => $request->all(),
            );
            
            return response()->json($response);
        }

    }

}
