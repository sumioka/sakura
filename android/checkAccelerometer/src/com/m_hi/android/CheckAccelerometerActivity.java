package com.m_hi.android;

import java.util.List;

import android.app.Activity;
import android.content.res.Configuration;
import android.hardware.Camera;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.widget.TextView;
import fj.hackathon.sakura.http.PhotoSend;

public class CheckAccelerometerActivity extends Activity {
	/** Called when the activity is first created. */
	private String TAG="CheckAccelerometerActivity";
	SensorAdapter ad;
	SurfaceView preview;
	private Camera mCam;
	private boolean mIsTake;


	private SurfaceHolder.Callback mSurfaceListener =
            new SurfaceHolder.Callback() {
                @Override
                public void surfaceDestroyed(SurfaceHolder holder) {
                    // カメラを停止する
                    if (mCam != null) {
                        mCam.stopPreview();
                        mCam.release();
                        mCam = null;
                    }
                }

                @Override
                public void surfaceCreated(SurfaceHolder holder) {
                    // カメラを起動する
                    mCam = Camera.open();
                    try {
                        mCam.setPreviewDisplay(holder);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void surfaceChanged(SurfaceHolder holder, int format
                        , int width, int height) {
                    mCam.stopPreview();

                    Camera.Parameters parameters = mCam.getParameters();

                    boolean portrait = isPortrait();

                    // 画面の向きを変更する
                    if (portrait) {
                        mCam.setDisplayOrientation(90);
                    } else {
                        mCam.setDisplayOrientation(0);
                    }

                    // サイズを設定
                    /*
                    List<camera.size> sizes = parameters.getSupportedPreviewSizes();
                    Camera.Size size = sizes.get(0);
                    parameters.setPreviewSize(size.width, size.height);
                    */

                    // レイアウト調整
                    /*
                    ViewGroup.LayoutParams layoutParams = preview.getLayoutParams();
                    if (portrait) {
                        layoutParams.width = size.height;
                        layoutParams.height = size.width;
                    } else {
                        layoutParams.width = size.width;
                        layoutParams.height = size.height;
                    }

                    preview.setLayoutParams(layoutParams);*/

                    mCam.setParameters(parameters);
                    mCam.startPreview();
                }
            };

    // 画面の向きを取得する
    protected boolean isPortrait() {
        return (this.getResources().getConfiguration().orientation == Configuration.ORIENTATION_PORTRAIT);
    }


	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);

		SensorManager manager = (SensorManager) getSystemService(SENSOR_SERVICE);
		List<Sensor> sensors = manager.getSensorList(Sensor.TYPE_ALL);
		//TextView comment = (TextView) findViewById(R.id.comment);
		String val = "サポートセンサー\n";
		for (Sensor s : sensors) {
			val += s.getName() + "\n";
		}
		//comment.setText(val);

		//ad = new SensorAdapter(findViewById(R.id.lvaluex),findViewById(R.id.lvaluey), findViewById(R.id.lvaluez));

		ad = new SensorAdapter();
		//preview = new SurfaceView(this);

		 preview = (SurfaceView)findViewById(R.id.surfaceView1);
	        SurfaceHolder holder =preview.getHolder();

	        holder.addCallback(mSurfaceListener);
	        holder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);

	}

	@Override
	protected void onDestroy() {
		super.onDestroy();
		ad.stopSensor();
	}


	private void takePhoto(){

		// 撮影中の2度押し禁止用フラグ
        if (mIsTake) {
        	return;
        }
        mIsTake = true;

        try {
    	    // カメラインスタンスの取得
            //mCam = Camera.open();
            //mCam.startPreview();

            // オートフォーカスを利かせる
            mCam.autoFocus(mAutoFocusListener);

            // 画像取得（オートフォーカスの結果で撮るのではない場合ここで呼ぶ）
             //mCam.takePicture(null, null, mPicJpgListener);


        } catch (Exception e) {
            // エラー
        	Log.e("camera","camera autofocusError",e);
            this.finish();
        }

	}
	/**
	 * オートフォーカス完了のコールバック
	 */
	private Camera.AutoFocusCallback mAutoFocusListener = new Camera.AutoFocusCallback() {
	    public void onAutoFocus(boolean success, Camera camera) {
	        // 撮影
	        mCam.takePicture(null, null, mPicJpgListener);
	    }
	};


    Handler handler = new Handler();
    Runnable clearGuardFlag;

	/**
     * JPEG データ生成完了時のコールバック
     */
    private Camera.PictureCallback mPicJpgListener = new Camera.PictureCallback() {
        public void onPictureTaken(byte[] data, Camera camera) {
            // カメラインスタンスを解放
            /*
        	if (mCam != null) {
                mCam.release();
                mCam = null;
            }*/

            if (data == null) {
                return;
            }

            Log.d(TAG,"test");





            // データをHTTPでサーバに送る
            PhotoSend photoSend = new PhotoSend();
            photoSend.execute(data);

            clearGuardFlag = new Runnable() {
                public void run() {
                    handler.removeCallbacks(clearGuardFlag);
                    mIsTake = false;
                }
            };
            handler.postDelayed(clearGuardFlag, 2000);


            mCam.startPreview();
            mIsTake = false;
        }
    };



    class SensorAdapter implements SensorEventListener {

		private SensorManager manager;
		private TextView vx;
		private TextView vy;
		private TextView vz;

		public SensorAdapter() {
			manager = (SensorManager) getSystemService(SENSOR_SERVICE);
			/*
			this.vx = (TextView) vx;
			this.vy = (TextView) vy;
			this.vz = (TextView) vz;*/
			List<Sensor> sensors = manager
					.getSensorList(Sensor.TYPE_ACCELEROMETER);
			if (sensors.size() > 0) {
				Sensor s = sensors.get(0);
				manager.registerListener(this, s, SensorManager.SENSOR_DELAY_UI);
			}
		}

		public void stopSensor() {
			manager.unregisterListener(this);
			this.vx = null;
			this.vy = null;
			this.vz = null;
		}

		@Override
		public void onAccuracyChanged(Sensor arg0, int arg1) {
		}

		@Override
		public void onSensorChanged(SensorEvent event) {
			if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {

				float ax = event.values[0];
				float ay = event.values[1];
				float az = event.values[2];

				double power = Math.pow(ax * ax + ay * ay + az * az,0.5);
				if(power > 11){
					Log.d(TAG,"takephoto()");
					takePhoto();
				}
/*
				vx.setText("" + event.values[0]);
				vy.setText("" + event.values[1]);
				vz.setText("" + event.values[2]);*/
			}
		}

	}
}
