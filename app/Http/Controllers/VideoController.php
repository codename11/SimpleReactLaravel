<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Videos;
use App\Subtitles;
use Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManagerStatic as Image;
use Carbon\Carbon;

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

                if($request->hasFile("video") && $request->hasFile("thumbnail") && $request->hasFile("subtitle")){

                    $filenameWithExt = $request->file("video")->getClientOriginalName();
                    $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
                    $extension = $request->file("video")->getClientOriginalExtension();
                    $fileNameToStore = $filename."_".time().".".$extension;
                    $path = $request->file("video")->storeAs("public/".auth()->user()->name."'s Videos", $fileNameToStore);

                    /*This resizing works.*/
                    $filenameWithExtThumb = $request->file("thumbnail")->getClientOriginalName();
                    $filenameThumb = pathinfo($filenameWithExtThumb, PATHINFO_FILENAME);
                    $extensionThumb = $request->file("thumbnail")->getClientOriginalExtension();
                    $fileNameToStoreThumb = $filenameThumb."_".time().".".$extensionThumb;
                
                    $img = \Image::make($request->file("thumbnail"));
                    $pathThumb = str_replace("/","\\",addcslashes(public_path('storage/'.auth()->user()->name."'s Thumbnails/".$fileNameToStoreThumb),"\f\r\n\t"));
                    $img->resize(240, 240)->save($pathThumb);
                    
                    $filenameWithExtSub = $request->file("subtitle")->getClientOriginalName();
                    $filenameSub = pathinfo($filenameWithExtSub, PATHINFO_FILENAME);
                    $extensionSub = $request->file("subtitle")->getClientOriginalExtension();
                    $fileNameToStoreSub = $filenameSub."_".time().".".$extensionSub;
                    $pathSub = $request->file("subtitle")->storeAs("public/".auth()->user()->name."'s Videos", $fileNameToStoreSub);
                    
                    $video = new Videos;
                    $video->name = $fileNameToStore;
                    $video->user_id = auth()->user()->id;
                    $video->title = $request->input("title");
                    $video->thumbnail = $fileNameToStoreThumb;
                    $video->description = $request->input("description");
                    $video->save();

                    $subtitle = new Subtitles;
                    $subtitle->name = $fileNameToStoreSub;
                    $subtitle->user_id = auth()->user()->id;
                    $subtitle->video_id = $video->id;
                    $subtitle->save();
 
                    $response = array(
                        "message" => "A success! File uploaded!",
                        "video" => $video,
                        "subtitle" => $subtitle,
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
            
            $subtitles = $video->subtitle()->get();

            $temp = "";

            for($i=0;$i<count($subtitles);$i++){

                $path = public_path("storage/".auth()->user()->name."'s Videos/".$subtitles[$i]->name);
                $temp = iconv(mb_detect_encoding(File::get($path), mb_detect_order(), true), "UTF-8", File::get($path));
                $subtitles[$i]->text = $temp;

            }

            $response = array(
                "video" => $video,
                "user" => $user,
                "size" => (float)substr($size,0,4),
                "url" => $url,
                "permissions" => $permissions,
                "prev" => $prev,
                "next" => $next,
                "subtitles" => $subtitles,
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
                
                    $img = \Image::make($request->file("thumbnail"));
                    $pathThumb = str_replace("/","\\",addcslashes(public_path('storage/'.auth()->user()->name."'s Thumbnails/".$fileNameToStoreThumb),"\f\r\n\t"));
                    $img->resize(240, 240)->save($pathThumb);
                    
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

                $filenameWithExtSub = null;
                $filenameSub = null;
                $extensionSub = null;
                $fileNameToStoreSub = null;
                $pathSub = null;

                if($request->hasFile("subtitle")){

                    $filenameWithExtSub = $request->file("subtitle")->getClientOriginalName();
                    $filenameSub = pathinfo($filenameWithExtSub, PATHINFO_FILENAME);
                    $extensionSub = $request->file("subtitle")->getClientOriginalExtension();
                    $fileNameToStoreSub = $filenameSub."_".time().".".$extensionSub;
                    $pathSub = $request->file("subtitle")->storeAs("public/".auth()->user()->name."'s Videos", $fileNameToStoreSub);

                    $subtitle = new Subtitles;
                    $subtitle->name = $fileNameToStoreSub;
                    $subtitle->user_id = auth()->user()->id;
                    $subtitle->video_id = $video->id;
                    $subtitle->save();

                }
                
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
            $path = "storage/".auth()->user()->name."'s Thumbnails/".$video->thumbnail;
            if($video->thumbnail!=="nothumbnail.jpg" && strpos($path,"nothumbnail.jpg")===false){

                File::delete($path);
            
            }

            $subtitles = $video->subtitle()->get();
            $subPath = "storage/".auth()->user()->name."'s Videos/";
            for($i=0;$i<count($subtitles);$i++){

                File::delete($subPath.$subtitles[$i]->name);
                
            }

            File::delete($subPath.$video->name);
            $video->delete();
            
            $response = array(
                'status' => 'success',
                'message' => "Video deleted",
                "path" => $path,
                "video" => $video,
                //"subtitles" => $subtitles,
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

    public function addsub(Request $request){

        return view('addsub');

    }

    public function addSubAjax(Request $request){

        if($request->ajax()){

            $videos = Videos::with("user")->get();

            $response = array(
                "videos" => $videos,
                "request" => $request->all(),
            );
            
            return response()->json($response);

        }

    }

    public function addSubToVideo(Request $request){

        if($request->ajax()){
            
            $validator = \Validator::make($request->all(), [
                "videoId" => 'required',
                "subtitle" => "required",
            ]);

            $video = Videos::find((int)$request->videoId);  

            if ($validator->passes()){

                if($request->has("videoId") && $request->hasFile("subtitle")){
                
                    $filenameWithExtSub = $request->file("subtitle")->getClientOriginalName();
                    $filenameSub = pathinfo($filenameWithExtSub, PATHINFO_FILENAME);
                    $extensionSub = $request->file("subtitle")->getClientOriginalExtension();
                    $fileNameToStoreSub = $filenameSub."_".time().".".$extensionSub;
                    $pathSub = $request->file("subtitle")->storeAs("public/".auth()->user()->name."'s Videos", $fileNameToStoreSub);

                    $subtitle = new Subtitles;
                    $subtitle->name = $fileNameToStoreSub;
                    $subtitle->user_id = auth()->user()->id;
                    $subtitle->video_id = $video->id;
                    $subtitle->save();

                    $response = array(
                        "request" => $request->all(),
                    );
                    
                    return response()->json($response);

                }
                else{
                    $response = array(
                        "error" => "Doesn't have all.",
                        "request" => $request->all(),
                    );
                    
                    return response()->json($response);
                }

            }
            else{
                $response = array(
                    "error" => "Validation didn't passed.",
                    "request" => $request->all(),
                );
                
                return response()->json($response);
            }

        }

    }

    public function modsub(Request $request){

        return view('modsub');

    }

    public function modSubOfVideo(Request $request){

        if($request->ajax()){

            $videoId = $request->videoId;
            $subtitles = Subtitles::where("video_id", "=", $videoId)->get();

            $response = array(
                "status" => "ok",
                "videoId" => $request->input("videoId"),
                "subtitles" => $subtitles,
            );
            return response()->json($response);

        }
        else{

            $response = array(
                "status" => "not ok",
                "requestAll"  => $request->all(),
            );
            return response()->json($response);

        }
        
    }

    public function openSubOfVideo(Request $request){

        if($request->ajax()){

            $subId = $request->subId;
            $subtitle = Subtitles::find($subId);

            $path = "storage/".auth()->user()->name."'s Videos/".$subtitle->name;
            $subText = iconv(mb_detect_encoding(File::get($path), mb_detect_order(), true), "UTF-8", File::get($path));
            $response = array(
                "status" => "openSubOfVideo",
                "subtitle"  => $subtitle,
                "subText" => $subText,
            );
            return response()->json($response);
        }

    }

    public function writeSubOfVideo(Request $request){

        if($request->ajax()){

            $subText = substr($request->subText,5,strlen($request->subText));
            $subText = substr($subText,0,strlen($subText)-6);

            $subId = $request->subId;
            $subtitle = Subtitles::find($subId);
            
            $pathToSub = "storage/".auth()->user()->name."'s Videos/".$subtitle->name;
            
            File::put($pathToSub,$subText);

            $subtitle->updated_at = Carbon::now()->toDateTimeString();
            $subtitle->save();
            
            $response = array(
                "status" => "ok",
                "subId" => $subId,
                "subText" => $subText,
                "message" => $request->message,
            );
            return response()->json($response);
        }
        else{

            $response = array(
                "status" => "not ok",
                "requestAll" => $request->all(),
            );
            return response()->json($response);

        }
        
    }

}
