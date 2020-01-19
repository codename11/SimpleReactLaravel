<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Stats;

class StatsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if($request->ajax()){

            $email = $request->formElements["email"];
            $password = $request->formElements["password"];
            
            $user = DB::table('users')->where("email", "=", $email)->first();
           
            if(Hash::check($password, $user->password)) {   
                
                $stat = new Stats;
                $stat->ip = $request->stats["ip"];
                $stat->city = $request->stats["city"];
                $stat->region = $request->stats["region"];
                $stat->country = $request->stats["country"];
                $stat->coords = $request->stats["loc"];
                $stat->timezone = $request->stats["timezone"];
                $stat->user_id = $user->id;
                $stat->save();
                
                $response = array(
                    "message" => "bravo",
                    "request" => $request->all(),
                    "user" => $user,
                    "stat" => $stat,
                );
                
                //return response()->json($response);
                return redirect()->intended('dashboard');
            }

        }

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
