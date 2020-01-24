<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
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
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(array $data)
    {

        $fileNameToStore = "";
        if(array_key_exists('avatar', $data)){
            
            $filenameWithExt = $data['avatar']->getClientOriginalName();
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $data['avatar']->getClientOriginalExtension();
            $fileNameToStore = $filename."_".time().".".$extension;
        
            $img = \Image::make($data['avatar']);
            $path = str_replace("/","\\",addcslashes(public_path('storage/profile_pics/'.$fileNameToStore),"\f\r\n\t"));
            $img->resize(32, 32)->save($path);
         
        }
        else{
            $fileNameToStore = "user.jpg";
        }
/*
        $to = "";
        $from = "";
        $message = "";
        Mail::to($toHR)->send($messageToHRFirst);*/
        /*
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            "avatar" => $fileNameToStore
        ]);

        $user->sendEmailVerificationNotification();

        return $user;*/

        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            "avatar" => $fileNameToStore
        ]);

    }
}
