<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

use Illuminate\Http\Request;
use Auth;
use App\Stats;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/dashboard';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    public function authenticated(Request $request)
    {
        
        $email = $request->formElements["email"];
        $password = $request->formElements["password"];
        
        if (Auth::attempt(['email' => $email,'password' => $password])) {
        
            $stat = new Stats;
            $stat->ip = $request->stats["ip"];
            $stat->city = $request->stats["city"];
            $stat->region = $request->stats["region"];
            $stat->country = $request->stats["country"];
            $stat->coords = $request->stats["loc"];
            $stat->timezone = $request->stats["timezone"];
            $stat->user_id = auth()->user()->id;
            $stat->save();
            
            $response = array(
                "stat" => $request->all(),
            );
            
            return redirect()->intended('dashboard');
        }
    }
}
