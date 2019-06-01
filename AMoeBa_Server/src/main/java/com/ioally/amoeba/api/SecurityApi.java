package com.ioally.amoeba.api;

import com.ioally.amoeba.dto.ResponseDto;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Map;

public interface SecurityApi {

    String PATH = AMoeBaApi.PATH + "/security";

    /**
     * 生成新的密钥
     *
     * @param param 生成密钥需要的数据
     * @return 密钥串
     */
    @RequestMapping(value = "generateKey", method = RequestMethod.POST)
    ResponseDto generateKey(Map<String, String> param) throws Exception;

    /**
     * 验证密钥是否可用
     *
     * @param param 验证密钥需要的参数
     * @return 验证结果
     */
    @RequestMapping(value = "verifyKey", method = RequestMethod.POST)
    ResponseDto verifyKey(Map<String, String> param) throws Exception;

}
