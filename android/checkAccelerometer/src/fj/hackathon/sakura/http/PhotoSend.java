package fj.hackathon.sakura.http;

import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.ByteArrayBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

import android.os.AsyncTask;
import android.util.Log;

public class PhotoSend extends AsyncTask<byte[], Void, Void> {

	@Override
	protected Void doInBackground(byte[]... params) {
		
		// 送信先
		String url = "";
		// jpeg画像データ
		byte[] jpeg = params[0];
		
		
		doPost1(url, jpeg);
		

		return null;
	
	}
	
	private void doPost1(String url, byte[] jpeg){
		
        DefaultHttpClient client = new DefaultHttpClient();
        HttpPost post = new HttpPost(url);
     
        // リクエストパラメータの設定
        List<NameValuePair> params = new ArrayList<NameValuePair>();
        params.add(new BasicNameValuePair("id", "id1"));
        params.add(new BasicNameValuePair("data", "data1"));
        try {
            post.setEntity(new UrlEncodedFormEntity(params, "utf-8"));
            HttpResponse response = client.execute(post);
        } catch (Exception e) {
            Log.e("FJHackathonCamera","",e);
        }
	}


	private void doPost2(String url, byte[] jpeg){
		
		ByteArrayBody bab = new ByteArrayBody(jpeg, System.currentTimeMillis() + ".jpg");
		
		MultipartEntity requestEntity = new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE);
	    requestEntity.addPart("picture", bab);
	    // その他、送信したいデータを追加

	    HttpClient client = new DefaultHttpClient();
	    HttpPost request = new HttpPost("http://10.0.1.9/upload_media");
        try {
    	    request.setEntity(requestEntity);
    	    HttpResponse response = client.execute(request);
        } catch (Exception e) {
            Log.e("FJHackathonCamera","",e);
        }

	}

}
