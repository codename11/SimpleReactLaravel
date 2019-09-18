<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Videos;
use Auth;
use Illuminate\Support\Facades\Validator;
//use Validator;
use Illuminate\Support\Facades\File;

class HomeController extends Controller
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

    public function index()
    {
        return view('home');
    }

    public function ajaxIndex(Request $request){    

        if($request->ajax()){

            $user = auth()->user();
            $response = array(
                "user" => $user,
                "request" => $request->all(),
            );
            
            return response()->json($response);
        }

    }

    public function ajaxUpload(Request $request){    

        if($request->ajax()){
            
            $validator = \Validator::make($request->all(), [
                'video' => 'required|mimes:mp4,ogx,oga,ogv,ogg,webm,avi',
                "title" => "required|min:6|max:24",
                "description" => "required|min:6|max:255",
            ]);

            if ($validator->passes()){

                if($request->hasFile("video")){
                    
                    $filenameWithExt = $request->file("video")->getClientOriginalName();
                    $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
                    $extension = $request->file("video")->getClientOriginalExtension();
                    $fileNameToStore = $filename."_".time().".".$extension;
                    $path = $request->file("video")->storeAs("public/videos", $fileNameToStore);
                    
                    $video = new Videos;
                    $video->name = $fileNameToStore;
                    $video->user_id = auth()->user()->id;
                    $video->title = $request->input("title");
                    $video->description = $request->input("description");
                    $video->save();
                    $response = array(
                        "success" => "File uploaded!",
                        "video" => $video,
                    );
                    
                    return response()->json($response);

                }
                else{

                    $response = array(
                        "error" => "There's no such thing!",
                        "request" => $request->all(),
                    );
                    
                    return response()->json($response);

                }

            }

            if ($validator->fails()){
                $response = array(
                    "error" => "Validation failed.",
                    "request" => $request->all(),
                );
                
                return response()->json($response);
            }

        }

    }

}
