def get_response_based_on_cer(request, lang_type, file_path, cer):
    if cer <= 0.3:
        try:
            user_id = request.POST.get('user.id')
            upload_path = f"/voices/{user_id}_{lang_type}.wav"
            print(upload_path)
            s3.upload_file(file_path, bucket_name, upload_path)
            user_profile = UserProfile.objects.get(user_id=user_id)
            if lang_type == "en":
                user_profile.voice_info_en = upload_path
            elif lang_type == "kr":
                user_profile.voice_info_kr = upload_path
            return JsonResponse(
                {"uploadSuccess": True, "confirm": True, "message": "초기 목소리 데이터 수집에 성공했습니다.",
                 "metric": {"cer": cer}})
        except Exception as e:
            print(e)
            return JsonResponse(
                {"uploadSuccess": False, "confirm": False, "message": "초기 목소리 데이터 저장에 실패했습니다. 다시 시도해주세요.",
                 "metric": {"cer": cer}})