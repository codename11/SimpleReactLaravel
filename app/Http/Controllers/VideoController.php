<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Videos;
use Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;

class VideoController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function create()
    {
        return view('create');
    }

    public function store(Request $request){    

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
                    $path = $request->file("video")->storeAs("public/".auth()->user()->name."'s Videos", $fileNameToStore);
                    
                    $video = new Videos;
                    $video->name = $fileNameToStore;
                    $video->user_id = auth()->user()->id;
                    $video->title = $request->input("title");
                    $video->description = $request->input("description");
                    $video->save();
                    $response = array(
                        "message" => "A success! File uploaded!",
                        "video" => $video,
                        "user" => auth()->user(),
                    );
                    
                    return response()->json($response);

                }
                else{

                    $response = array(
                        "message" => "An error. There's no such thing!",
                        "request" => $request->all(),
                    );
                    
                    return response()->json($response);

                }

            }

            if ($validator->fails()){
                $response = array(
                    "message" => "An error. Validation failed.",
                    "request" => $request->all(),
                );
                
                return response()->json($response);
            }

        }

    }

    public function list()
    {
        return view('list');
    }

    public function index(Request $request)
    {

        if($request->ajax()){

            $videos = Videos::with("user")->get();

            $response = array(
                "videos" => $videos,
            );
            
            return response()->json($response);

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
