<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Videos;
use Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManagerStatic as Image;

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
                "thumbnail" => 'required|mimes:jpg,jpeg,png,bmp|max:1999',
                "description" => "required|min:6|max:255",
            ]);

            if ($validator->passes()){

                if($request->hasFile("video") && $request->hasFile("thumbnail")){

                    $filenameWithExt = $request->file("video")->getClientOriginalName();
                    $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
                    $extension = $request->file("video")->getClientOriginalExtension();
                    $fileNameToStore = $filename."_".time().".".$extension;
                    $path = $request->file("video")->storeAs("public/".auth()->user()->name."'s Videos", $fileNameToStore);

                    $filenameWithExtThumb = $request->file("thumbnail")->getClientOriginalName();
                    $filenameThumb = pathinfo($filenameWithExtThumb, PATHINFO_FILENAME);
                    $extensionThumb = $request->file("thumbnail")->getClientOriginalExtension();
                    $fileNameToStoreThumb = $filenameThumb."_".time().".".$extensionThumb;

                    $image_resize = Image::make($request->file("thumbnail")->getRealPath());              
                    $image_resize->resize(320, 240);

                    $pathThumb = $request->file("thumbnail")->storeAs("public/".auth()->user()->name."'s Thumbnails", $fileNameToStoreThumb);

                    $video = new Videos;
                    $video->name = $fileNameToStore;
                    $video->user_id = auth()->user()->id;
                    $video->title = $request->input("title");
                    $video->thumbnail = $fileNameToStoreThumb;
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

            $offset = $request->offset*6;
            $videos = Videos::with("user")->skip($offset)->take(6)->get();

            $response = array(
                "videos" => $videos,
                "request" => $request->all(),
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
        return view('show');
    }

    public function ajaxShow(Request $request)
    {
        if($request->ajax()){

            $video = Videos::find($request->videoId);
            $user = User::find($video->user_id);
            $permissions = auth()->user()->id===$user->id;

            $url = 'public/'.$user->name."'s Videos/".$video->name;
            $size = ("".((Storage::size($url))/1024)/1024);
            
            $prev = $video->prev($video);
            $next = $video->next($video);

            $response = array(
                "video" => $video,
                "user" => $user,
                "size" => (float)substr($size,0,4),
                "url" => $url,
                "permissions" => $permissions,
                "prev" => $prev,
                "next" => $next,
            );
            
            return response()->json($response);

        }

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
    public function ajaxUpdate(Request $request)
    {
        if($request->ajax()){

            $video = Videos::find($request->videoId);  
            
            $validator = \Validator::make($request->all(), [
                "title" => "required|min:6|max:24",
                "description" => "required|min:6|max:255",
            ]);

            if ($validator->passes()){

                $filenameWithExt = null;
                $filename = null;
                $extension = null;
                $fileNameToStore = null;
                $path = null;

                if($request->hasFile("video")){

                    $filenameWithExt = $request->file("video")->getClientOriginalName();
                    $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
                    $extension = $request->file("video")->getClientOriginalExtension();
                    $fileNameToStore = $filename."_".time().".".$extension;
                    $path = $request->file("video")->storeAs("public/".auth()->user()->name."'s Videos", $fileNameToStore);
                    
                    $video->name = $fileNameToStore;

                }

                $filenameWithExtThumb = null;
                $filenameThumb = null;
                $extensionThumb = null;
                $fileNameToStoreThumb = null;
                $image_resize = null;
                $pathThumb = null;

                if($request->hasFile("thumbnail")){
                    
                    $filenameWithExtThumb = $request->file("thumbnail")->getClientOriginalName();
                    $filenameThumb = pathinfo($filenameWithExtThumb, PATHINFO_FILENAME);
                    $extensionThumb = $request->file("thumbnail")->getClientOriginalExtension();
                    $fileNameToStoreThumb = $filenameThumb."_".time().".".$extensionThumb;

                    $image_resize = Image::make($request->file("thumbnail")->getRealPath());              
                    $image_resize->resize(320, 240);
                    
                    $pathThumb = $image_resize->save(public_path("storage/".auth()->user()->name."'s Thumbnails/".$fileNameToStoreThumb));
                    
                    if($video->thumbnail!=="../nothumbnail.jpg"){
                        
                        unlink(public_path("storage/".auth()->user()->name."'s Thumbnails/".$video->thumbnail));
                        $video->thumbnail = $fileNameToStoreThumb;

                    }

                    if($video->thumbnail==="../nothumbnail.jpg"){
                        
                        $video->thumbnail = $fileNameToStoreThumb;
                        
                    }
                
                }
                else{

                    if($video->thumbnail!=="../nothumbnail.jpg"){
                        
                        //unlink(public_path("storage/".auth()->user()->name."'s Thumbnails/".$video->thumbnail));
                        //$video->thumbnail = "../nothumbnail.jpg";

                    }

                    if($video->thumbnail==="../nothumbnail.jpg"){
                        
                        $video->thumbnail = "../nothumbnail.jpg";
                        
                    }

                }

                $video->title = $request->input("title");
                $video->description = $request->input("description");
                $video->save();

                $prev = $video->prev($video);
                $next = $video->next($video);
                
                $response = array(
                    "message" => "A success! File uploaded!",
                    "video" => $video,
                    "user" => auth()->user(),
                    "prev" => $prev,
                    "next" => $next,
                );
                
                return response()->json($response);

            }

            if ($validator->fails()){

                $response = array(
                    "request" => $request->all(),
                    "video" => $video,
                    "message" => "An error. Validation failed.",
                );

            }

        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function ajaxDestroy(Request $request)
    {
        
        if($request->ajax()){

            $video = Videos::find($request->videoId);  
            $path = public_path("storage/".auth()->user()->name."'s Thumbnails/".$video->thumbnail);
            if($video->thumbnail!=="nothumbnail.jpg" && strpos($path,"nothumbnail.jpg")===false){

                unlink($path);
            
            }
            $video->delete();

            $response = array(
                'status' => 'success',
                'message' => "Video deleted",
                "ddd" => $video->thumbnail!=="nothumbnail.jpg" ? "nije" : "jeste",
                "path" => $path,
            );
            return response()->json($response);

        }
        else{
            $response = array(
                'status' => 'fail',
            );
            return response()->json($response);
        }
        
    }
}
