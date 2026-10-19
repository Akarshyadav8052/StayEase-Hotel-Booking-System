
package com.Akarsh.dtos;

import lombok.Data;

@Data
public class VarifyPaymentRequest {

	private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
