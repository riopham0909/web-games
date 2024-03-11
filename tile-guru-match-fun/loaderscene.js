/**
 * Created by slava on 3/30/17.
 */

// eslint-disable-next-line max-len
cc._loadingImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAU2CAMAAAD9CcM0AAADAFBMVEUCAgEDAwIEBAMFBQQGBgUHBwYICAcJCQgKCgkLCwoMDAsNDQwODg0PDw4QEA8RERASEhETExIUFBMVFRQWFhUXFxYYGBcZGRgaGhkbGxocHBsdHRweHh0fHx4gIB8hISAiIiEjIyIkJCMlJSQmJiUnJyYoKCcpKSgqKikrKyosLCstLSwuLi0vLy4wMC8xMTAyMjEzMzI0NDM1NTQ2NjU3NzY4ODc5OTg6Ojk7Ozo8PDs9PTw+Pj0/Pz5AQD9BQUBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYCCgoGDg4KEhIOFhYSGhoWHh4aIiIeJiYiKiomLi4qMjIuNjYyOjo2Pj46QkI+RkZCSkpGTk5KUlJOVlZSWlpWXl5aYmJeZmZiampmbm5qcnJudnZyenp2fn56goJ+hoaCioqGjo6KkpKOlpaSmpqWnp6aoqKepqaiqqqmrq6qsrKutrayurq2vr66wsK+xsbCysrGzs7K0tLO1tbS2trW3t7a4uLe5ubi6urm7u7q8vLu9vby+vr2/v77AwL/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Ozs7Pz8/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc3Nzd3d3e3t7f39/g4ODh4eHi4uLj4+Pk5OTl5eXm5ubn5+fo6Ojp6enq6urr6+vs7Ozt7e3u7u7v7+/w8PDx8fHy8vLz8/P09PT19fX29vb39/f4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7///+xGNHLAABQFUlEQVR4AezSP2vVBxQA0JumCaUpdGpLW1oaCk3JkCUdSraEfoGGDoV2bad2URwE0clVlIc4OIkuDlE3CWRwcVHQVU0IakRDJGAkSv7EdzW+32/U3fvO+QwnEvpGJOgOuoPuoDvoDrqD7qA76A66g+7oDrqD7qA76A66g+6gO+gOuoPu6A66g+6gO+gOuoPuoDvoDrqD7ugOuoPuoDvoDrqD7qA76A66g+7oDrqD7qA76A66g+6gO+gOuoPuoDu6g+6gO+gOuoPuoDvoDrqD7qA7uoPuoDvoDrqD7qA76A66g+6gO7qD7qA76A66g+6gO+gOuoPuoDu6g+6gO+gOuoPuoDvoDrqD7qA7uoPuoDvoDrqD7qA76A66g+6gO+iO7qA76A66g+6gO+gOuoPuoDvoju6gO+gOuoPuoDvoDrqD7qA76I7uoDvoDrqD7qA76A66g+6gO+iO7qA76A66g+6gO+gOuoPuoDvo/g7oDrqD7qA76A66g+6gO+gOuoPu6A66g+6gO+gOuoPuoDvoDrqD7ugOuoPuoDvoDrqD7qA76A66g+7oDrqD7qA76A66g+6gO+gOuoPu6A66g+6gO+gOuoPuoDvoDrqD7qA7uoPuoDvoDrqD7qA76A66g+6gO7qD7qA76A66g+6gO+gOuoPuoDu6g+6gO+gOuoPuoDvoDrqD7qA7uoPuoDvoDrqD7qA76A66g+6gO7qD7qA76A66g+6gO+gOuoPuoDvoju6gO+gOuoPuoDvoDrqD7qA76I7uoDvoDrqD7qA76A66g+6gO+iO7qA76A66g+6gO+gOuoPuoDvoju6gO+gOuoPuoDvoDrqD7qA76A66ozvoDrqD7qA76A66g+6gO+gOuqM76A66g+6gO+gOuoPuoDvoDrqjO+gOuoPuoDvoDrqD7qA76A66ozvoDrqD7qA76A66g+6gO+gOuqM76A66g+6gO+gOuoPuoDvoDrqD7ugOuoPuoDvoDrqD7qA76A66g+7oDrqD7qA76M7La2cvLmU/0J2l2c8ixs7sZnm683Qm9n1yLsvTnU70TK5mcbqzNRs9g/NZnO7cH4/GqSxOd258EY0DWZzuzH8ajT93szbdufxxNKY3sjbdmRuMxsRa1qY7V4ai8cNK1qY78yPR+Ope1qY717+Mxuc3szbduTMWjaG5rE131qaidTxr052d36P1dzdr053/ozW1nrXpzolofXsra9OdqyPR+Oh81qY7y6PROpi16c7Wb9GaeZ616c6xaH29mLXpzsJQNAYXsjbdefZrtDpZnO50ovVvN2vTnccT0Zh5kcXpzumB6BlfzeJ0Z/2X6Bl9kNXpzqXheOv75axOd7pHBnrdH2Z5urP5X+z7cTXr053Nw8MR8fN69gHd2bvwU8TkRvYF3Vk89N0/29kndOfJo1dZn+6gO+gOuoPu7HSzP+jO7aN//HVyJevTne3ON/HG9N1E9/fY28sP32v27sM9qmp9+/i9p6QHEgLSe0ERsABKQbEoFrEAHjlKEdCDRbGIooiooFgURfmJBVCxewRROYigIiAIIohKAQHphBJIQnrJZO73nZk9mT2TMnt6Qp7PlT/he032XnutZ+U9YoDdWAsrIST34ytnPvnU7LUnWbNZphjh0PckheResZ9ubRdrMMS1/c9K1mjz46G6PJdCcq9Iydx2UDX/v2LWXHvPgcrwIiskJPdvWqJM9JQi1lgT4XTpMVZESO67r4RG9IusqTY1hKrDH6yQkNzn1oNWnW9YQz0JVZ15rJCQ3IvvNsBNx02skbLPg2psKYXkXqGM6+BhYD5rok2N4ND1IIXkXrHjV8GDYTprouWJsDN+QiG5VyJvGDylrGEN9Etd2I3Mp5DcKzM1Cp7O2sGa58TZsLlmN4XkXqlV7VDOJYdZ88xpAESPPEghuVcu/3EjyhmWyxrHsvThh/+XSyG5V2XfNShHebyEQnI/Ff3TH+UYX6OQ3E9J+283wVPihwyTkiILheQePvmftIOn0xYwlApTN//24+fTn5n85INjbh1117inZ3yydMPujPyiUgrJPcR2jUmAh+Y/MiSKj/+xYPrd1/VtFacYDdBSohud0feG2x/7vwUbj5QwRAQoCub1gIcz1jPo9i+bMaxPi2gFVTI16T1m5o97Chkikrs48mg83J2zkcGUs2X2bd3rKNAp7szb399ZzNCQ3MXS8+GuxyYGy4mfJl91mhE+ajr0g51WhoLkLo6OVeCmzzYGQ/HqFy9vAL8Yu47/IYehILmLD1rAzUV7GLADn9zYGAFIHvJRBkNAchcbLoKbKw8yILkr7j3dgAAZL5qVThH83MXR+4zQunof/Zf5xY3JCAbjBW+doAh67qJkdlNoXbybfkr76MoYBIv5oo9OUgQ9d/FzX2j13UJ/ZH92SVWxR6c0PuPSm0ffef+kl2dMe/bR+0YOuujsVilxRlQqcfDKUopg5y5S7zRD45y19FnevCuiKy29Yc8xz7y7+p+0zHyWsRYXZB3c/PPX70wec1mbeFSo/oQDFMHOXRTOag6Ndsvom+LlN8WiQjGtB0784s+jxayCZd+iyTd0qYMKdPmwmCLYuYu1l0Cj1Y/0xbax9VGR2PPv/3BHHvUo2j//rjOjUE7s7X9SBDt3cWxcLFzO2UHdMmedgQok9Zq08hB9kTZ/cFOU0/GdXIog5y5KPmoPl+et1GnZNRX9KPd4cuUJ+qx43aNd4Cl+2HaKYOcudvxbgdNN2dRl5yN1UU6z2z87Sj/9/dw58HTuVxTBzl3kT2sA1agc6nDy7a4op8vjv5cwAP9M6wwPSc/lUQQ7d7HkfNhFzbHSu403xcCDqceMfQzUjgeT4M74n0MUwc5dHJ+YAsBwxzF6lftme3gw9HrnKINh9b/NcHfFVoqg5y5WPzx4xHsn6NXOW2PhofurBxkkJ2d0grtzv6cIfu6i0ELvFp4DD82n7GMQbR1hhptWX1BEIneR+lgy3CXdtoHBVfhma7g57Z1ihp3kLn68EO6UixYXMejW9oGbxOmlDC/JXeS/0gTuOrySzlA4dKcZWgmvh7d3yV3sGW2Gm8Q7tjBEil9Nhlbi6xaGj+QuVveFuz7/LWbIWD9oBa06cxgukrso/bg13CSHek/6D2dCq8GnDA/JXWQ/kwQ33b4uZYj9fDa0Wv7IcJDcxb7hcBNz2y6G3m/dodV9C4XkHnrr+sBNu9n5DIdN3aB11WEKyT3U5rWCm+v/ZJis7wqt/+RQSO4hVfB8ErTqTT3JsPm5HTQM06wUknsIZT4UDa1u34Y1uW8bQaPREgrJPXRO3K5A6+a/GV6zE6Fx4SEKyT1UDtwErTqTTzLMip8yQeOxYgrJPTQ2XwmtFh+WMuwyboZG8jcUkntI/NoDWt1XMBJ2dofGhWkUknsILOsErRu2MzIWpcDFMKWUQnIPum/bQCPq4QxGiHUyNJpvoJDcg21+M2ikzLQwYjKvhMbwHArJPbg+agiNlvMYSUtPg0v8JxSSe1B91AAanb9nZE2ExkVpFJJ7EH1yGjR6rmeE7e8GF+MbVgrJPWg+awKNy7Yz4mYb4dIjlUJyD5a59aHxrwOMvPSL4WJ8m0JyD5J3k6Ex/Birg89i4XLRcQrJPSjm1IXGmAxWCycHwCX6YwrJPRg+S4GL8f4sVhPz4uEyMJ9Ccg/c/MZwMT2Uw+oi60q4NFhJIbkHbElLbe1PFLL6mBsDl3ElFJJ7gH7tBJfoCQWsRo5dAJdOf1NI7oHZ0hMuhnF5rFamG1DGNINCcg/I333hYhyXw+plZyu4XJVJIbkHYM+lcDE+nMtqpnAUXFJ+ppDc/XfsWmg8UMhq53MjXJ6hkNz9ljECGqOzWP3s7gqXq3IoJHc/5d0PjZtOsBoqHQOX5usoJHc/vRQFl8GprJa+iEMZwwwKyd0/81Pg0v8Aq6ddXeEyMJtCcvfH8pZw6b2V1VTJCLh03EIhufthVze4nPs7q63XDSgTP5++k9xF9o1wab+G1dfqRLhMttJXkrsoegguDZewGkvtDpfrcukryV28EYsyiXNZnRXcCpf2/9BHkrtY2QxlTC9YWa09A5fk7+gbyV3sPB9llAeKWb19k4wyynT6RHIXhXfAZcARVnPb2sLlwRL6QnIXHyWizLl/sbo73g8u12bSB5K72NIBZZotY7VXPBIuZxygkNz1KxiKMjEzWQOMh0vjPygkd/1mm1Hm3kLWANMVlKm7lEJy1217e5S5+DhrgvnxKGOaSyG561U8FmWar2GNsCIZLtMoam/uWWu+/Pyr5ZuPFFCfhQlwiprOmuH3JnB5uJRVKDyeeqxIcj9VLb+mHqDUaXbuZTcOGz3mnvvGPfrEKx+t2ptVwoplXIMyg7JZM2w7Ey7DClmJg/974Y4repzV/cq7pq/KldxPQUtboTxDfINW3YdM/XZHAct5LxZOLdawhjjY2/t51YwVd7Uywyn+wjfTJPdTTUZ/VKHJNZMXH6WbtPPhZJ7GmiLrMrj0O8ryNj7bHe6ilkjup5oN9VG12LPHL8+hy/+Z4XRxOmuKoqvg0n0vPVjX3NoQngYeltxPNavqwquLd7FMahc4xS1kjVFyPVxO30U3Jd/fEINyrjn1apfc93aCN5ctL2GZN41wuq+YNUbhELi0cs9966gElDcolZL7Kcc6FVVr/WI6XU5cDKcWm1lz5A2DS7Nt1FjQGuVFP5xJyf0UlP1EfVQq+YrXD1Dry7pQKZNKWXPk3gqXJr/TZW4dlNf1Cysl91OS5YdHLm+ZoMCTqf4lz67IoZviUXDqtJU1SOFouDRayTK/1Ec5zZ7cQ0rup6zCI5u//b9xQ6+7vF+f3j179ep1Qf+hT3y0/lAhPW3rBJUygTVJ6Ri4NPiOTiVD4anNhF2k5C7I2VFQtV3PGuUOuCQtotOe9nATffEru2knuYuRcBpezBrldrjELabTlmbQaPvQz9l0kNzF3s5QJSxgzTIcLjHf0ymtD5zqXDvnOAWoEgtjoep+gjVK6WC4xC2jk3WmEXbN711upZDcNabA6QHWLLnXwiVhGctkP9vcqCRdPOsg3UjuonQ4VIlfsmZJvwIuSUvpUrj+g/fX5NKD5C7SL4HqzF2sWY5cDJf6Sygkd282tYfqhmLWLPt6wqXh9xSSuzf/S4bqIdYwO7rCpclyCsndm5lmqKazhvmrLeDLISzJXUyESvkva5i1DeHSbhOF5K77y2T8SoZE4a51f6QzFJYmwuWMPRSSuxeFA6Fqso0Byd/09SdLd+TQ3YmvR56e0nDAKobA5zFwOS+NQnL3Iv1yqE7fxwBkfXpDq4To+Bb9J6/KYpld0/pGwabt9wy+t81wuTSDQnL3IrUPVN2P0H8bB8dClXLhhE9/3JqRl73j67HtAaBhlwZA28V0Z2XAXlDgcn02heTuxT/nQHVJBv2V9mJTIO6ysY/de20LADAktuh8zlktogGYuj+zNXtpW6DFrAw6pc2fOGb4yCdXMyCWR6ExooBCcvdi65lQDcihn5ZdAuCCeVkkCze+dk19lEm84aNDJPlVU8B8+VsbDxaQ2X+92jceNvXv3ccAFP4HGmMtFJK7FxvbQXVzMf1yYsppQKOpR6jK2/zp2CvPP/uss7pd9uSqHDp8dwYAQ8Nzrx16y0VNUKbT11b6LWcgNJ6gkNy92dACqv/QL8v6A8Yb11DLWlxYUFBQWEKXP0YlwaXeoAcGRQNA7CMZ9Fd6P7gor1BI7t5sOC2gPQRHJyYDbWbm0av8pQ92STQBQFSbB1bks3h2fdgM3kc/7e8MF9MHFJK7N5tSoJpEn2V/2BtIvH0L9Tmxad7LT0+a9u0h2n3TADbnr6d/1jeGS8J3FJK7N9vqQfUCfXVylBHGy78ppp8+T4FNp5/ol2/j4dJoDYXk7s3mZKim0lfrEoBJGfTfG2bYNPuG/nhbgUvHzRSSuzcb60P1qJU++i0JeJkBsEyAXdN5VvpuAjR67qOQ3L35oy1UtxXSRxtPAy7MZABy74Ddad/SZ6W3QOPqNArJ3Zt9PaC6voA+2nMWYP6CgcgYDruWvvee0Rcao/MoJHdvci+Aqn8ufZQzCMDAwsB6HwK7tpvoo7/bQmOChUJy96o/VH2O0Ff3A2iwmgFJvQ52Vx2nb36qC403KCR3726Gqs02+uptE4DHShmQg1fA7nn6Zq4CF/PXFJK7D+sb8b/QV7/UBdD5EAOz9TzYdD1In0yFRoPfKCR372ZCZfoffXWgIwDDFwzQr45dwwvoi6I7odHpAIXk7t38aDgYnqOv8gcCwFALA/RhPAC8WHSghLplXguNS3MoJHfv1reCagR99igAtN3OAFmeB4DJX/W5der3+dRnX3dojLBSSO7eHQvkONOn8QCMsxiovFsBvDwAwEV7qc+GptCYSB0kd1E4CKomf9JXG5sDwJASBiq1H+pNSwEwNIv6zIuGi+FN6iG5iyegMiykr470A4B22xiw39oPeQoAnqROk6CR+D/qIbmLj01QPUpfWcYCgHEOA7d26aUAzHOpT9710GjxB/WQ3MX6RlD1L6KvZpgA4LYCBm7daQAaLKM+f58OjfMOUw/JXaT3DOC76up6ANB2DwM33QzgrB3U55s4aNxSQD0kd1E6Dio/djemtgeA6C8ZsLzBAHBjOvV5HlrPUh/JXXyiQPUYfZX/L9jcz4DtbAMAEwupS84t0Ij5kvpI7mJLB6j6ZdFXk2HTJ42B+i4GgHmOlbps7wKNlhupj+Quiq4uy2YDffVZPAAk/8xAvQgAsd9Rn2/qQOPio9RJchdToFLm0Feb2wGA4QUGqOBaADhtsz+r7riniDpJ7uLHOKhuyaePMi+FzcBAg9vWGAA6H6UumVdA6y3qJbmLfV2garKTPrKOh027rQzMwigA6F9AXX5tBo3ktdRLchfWW+E0i776wASbLxmYVxRf5lTOMECj1wnqJrmLuWaobi6gjzY2gc1DVgaiYLQvk8wKhkNrjIW6Se5iRxuoWu+gj052g02vkwzE/u4AEPcFddnSBRrmt6mf5C5KxkBleos+stwBm8a/MhAr6gJAqw3U5b0YyHhIyd1v/42D6vo8+uhN2CizGYh3YNPzCPUouR1afY/QB5K7ONEVqobr6aOlSbC5zcIAjIfNoCLqsaMLtMaV0BeSu3gATlPpo4M9YHPuMfovfzBs7qYuH0ZDwziPQnL3ycJYqLodp28sQwBdO9W9/15PoR5FI6HVejeF5O6To92giplPH70Ku1fov68TAMA4m3ps6QStmy0UkrtvJrnyKaJvfkiAza0F9NtLsEn4hnq8HwUN05sUkruPfk2CKmUdfbO3C2zapNJvd8LmtLXUoWg0tBr/TiG5+yj/RjhNoG8Kr4dNwgr6q2AAbNrupA7bukKrfwb9J7nL0nvX/X4d8VBeor+Od4dN7zTq8HEMNJSnrRSSu6/SesHp/3wsaLEjwOFF9NPWprAZUeT7N6Y631NI7r57Ef7e47GtHWy67A5sYcbwPHXY2Qla5xyikNx9t6MdVHW+pU8KBsEm+Xv6aYoCAAlfUod3jdC6x0IhufvOOgZONxbSJ+PtuRqepX/yh8Cm2W/0Lv8maJnmUUju/vjeDFXdNfTJguiAhhsdOV//w9DaRtDquJdCcvdHzpVwustKX2xvCJtOe+iXra1hc1EavbI+Cze3Wigkd7+8FQ1V4zX0RfqlsDGvoF9W1oPNjbn06tDF0Ip7n0Jy909qNz/fAK13we41+mWeGTZ3ltCrbxKh1XE7heTupzdMUDX/g754Kwo2N1sDuQ3tSXpluRtu7iygkNz9tK8rnO4vpQ/WNIRNj4P0x0TYvenrmGuY51FI7n57Hk6NfqcPDnaHTd2f6If8EbCJ+opevQ03XQ9RSO5+S+0Epwet1K/4P7AxzKAf9veDTf1V9Obk1XDzOIXkHoApcGqxlT6YZoDNsBL67te2sGm/jd78lACtuj9TSO4B2NIKTg9Yqd/KurC5II2+m58Imz6H6UXRQ3BzeRaF5B6A0glwavoX9UttAZvGv9F36gS8wV7j3dQRWoYXrRSSeyB2tILTQ9Qv71rYzaPvHobduGJ6Md0ErUbrKCT3wDyuQNVkA3WzToTd0/RZ6c2wMb9FL473g5sbMykk98BsaQune4qp22wzbK610FdZjooTv6MX8+Lg5h0rheQeoKkKVI1/oW7rWsDmrAP01f7OsGm6iVUrugZu2uygkNwDtbcznO62UK9jPWCTuJS++qs1bLoeZNW+i4ObsRYKyT1gz8Ip+RfqVTgKdu/QV8sbwuaiE6xS3hC4SVpGIbkHbl87OA0tpl7TYHdHMX20oA5sBueySssbw8312QwCyV28oECV/BP1WpTg57UGs6Jgc1sRq1L6oAFa5ncoJPcgP70PKaBOe5rDpuUmP5+dHrOyKn93hptuuxkUkrt4UYEq/gvqlH0BbKLmU+Xj0ZBprNJLJrh5msEhuYvU7nDqd4L6WB6G3cv0TcYA2H3Aqhw+D25a/s4gkdzFXBNUxlnU6W0f325VW8+CTdRSVuU1A9zcaWGQSO4i8xI4nX+Y+nyfApvzTtAnPzWBTf3fWYX9Z8FN0ncMGsldfBULp+eoT2oX2LT4jT75NBY27f5hFabC3TVZDBrJXRQMgVOrTdSl8ArYGD+mT6YrsOlxlJXb0hFuYucyiCR3saYOnMZRF+t42L1InzwGuyuyWamSyXDX8wiDSHIXltFwaryJusyG3ZBC+sA6EnbDilipPzvATfQMBpXkLtY0htNIfQEvTYZNl3T6IP8q2D1sZWVKxxngpncqg0pyF9YJcKq7iHrsPhM2Tf+gD9K7wUZ5mZVa3xoh3j8guYsDXeHU/yR1yLoUNlGf0ge7W8Am/jNWpuQuuOubxmCT3MX/maCKmksdisf5ce/2umTYNFvJyvzUCG6M7zPoJHeReQGczkmlDu/A7t951G9xPGzO2sZKpN8IdxemMfgkd7EgFk4TS+ndD/Vg0y2V+n0cBZv+h1mJ9+LhJuY9hoDkLoqHwanRWnqXeiZsWq7zfcjMiCxW7J/ecHfZEYaC5C5+S4HTkBJ6VXwRbMwf+n45/fgiVsjyBNzFzGVISO6i5CE4xX1Jr6wPwO556ma9G3YvlbJCy5vCXf9jFD4DhW+XmPZMpVdvwe526lZ0E2wM77JCJ6+Fu/gPGCqSu3g3Gk6T6NXXMbDplUe9stVbnf7HCr1mhrvrMhkqkrvI/xecmq6lN5vPgE373dTrcHfY1FnLivzZEu7qLmToSO7il4ZwuimXXmT21r3pQLXtDNg0384K5AyEhzFFDCHJXTwGlY5T10VDYTeTeq1pUcUIselmuOuwmaEkuYv9Z8Pp/KP04gXYPWqhTl/Xh80FJ1jeymZwF/UqQ0tyF5+Y4PQEvfjUCJv+WdTpnTjY3JDDcv65GB4GpDG0JHdRPAROTTayamsawaZDKnV6xgib0cX0lHMHPDRdylCT3MW6RnC6pYBVSu0Imwa/Up/ie2H3YCk9vRQDd8rkEoac5C6eUKCK+y+rlNMfNqaPqc/JQbB7hp4W1oeHaw4z9CR3kdoXTudV3ZxlPOxeYpWyDh7at/LD9//kob6we5se/uoED81WMhwkd7E4EU7jrazKW/B8Fi/KzSu2FmWlpaYe3vrz0qUL35pw13+uP6tRSnKsocuGPZ1hY/qK7vZcCA+G1xgWkruwPgyn5GWsykL1jtRM8thfi2c888zjdw4ddP3g6/tf0K1z5w6NYuDmtjVtYVN3Od0cGQhPg/IYHpK7OHIunK5IZxW2t4NNl9STb/RvkohyTFFxdVv3GjBw1KT3Pr0UTR9vDpumG6l14jZ46riV4SK5i//GQmWczipk94BNs2nXGwC0P+e8vr3O633pNTcOGTx45CMvvz7j/cUbN28+YKHN/2KUNvVgc/pOamTdbYSHOh8zbCR3UTgcTm13sXKWobCJTknomNBi8rb9abnZaalH0ovIooISusu5DgYjbM5LpUvuo1HwoIwvZPhI7mJbWzjdWcrKTYFDhw5XbaQXq5rC4bIMlimaGAVP16YxnCR3MSsWqjqLWbl3DbCLu0NHom8lwm5ALp1yJ8TAU5eNDCvJXeQPh1OfE16vjYyaVEDvcvrB7tyjtLPmrB1ohKd63zDMJHex8ww4TShlZf45EwCazKcemRfDLvq/JHP3LJx0SQLKiXuTYSe5i89joUpZxsqc6Aeg3SrqsqcLHK7+e/Fz/zo93oDyYp4uZNhJ7sJ6D5wuTGdlHgLabqA+21vDxqCYmsQZUCHD+AIKyT0CNNffPZmenlXKCuSMREt9tecf3T6nHrww35tFIblHxI9JUNUddMOND763Zv/JwlJqlK4bYWi5hlUpyfzn168/enPSkJ5tG0ShagbTvZkUknuETDNAK6FJh3P7XD5w5LhJz736+pxPFyxd0AVdluSWWOmp5PjahfPeffbeof1PPy0xxqhAl4Qp2RSSe6Tkj0IlFIPRFB2fFJ9y3nW3j5/62pvvzJ4z543pr097/M6hA3q1a1I/McpoUKCfYlQMxhtyKCT3yDncF05RqIICKAiEIdZojrkqj0Jyj6DNvZPNgKHxxfc8fE40QkeJNZujOh+mkNwjaeedBuC0+XuyCw/OvLyhWUGIGE1mU9NdFJJ7JB24RgHaHqNNxs8zx3RPMikIIkVx9h5lTPmDQnKPpI3tAHRMp5V2RYd+nHFn3yYxioLAKYbo+t2uNMNOMRsT11JI7pH0UwqA07OoUXh0/fwXhp6dYoICfynG+Kbn3vTUvA3HVjUoyz12GYXkHknfxwNok0N31uLsPasXTBvVq2mcCT5RDOaE5j2HTHx36e97M4tJbu0MB5MxagmF5B5J38YCaJLDClgt+ambVn418+F/9WzXqG5clNloUP4/lKPAYDBFxyU3Pf2S4U+8PX/5X4fySum0qz8cjEbzNxSSeyQtiQGQdIBelKT+tmThgi8+nfv+7JkvTbrr31dd1LfPBf36XzP436Pvf/rltz/4/MtFS39ev+N4ET3tGQEHg9E8n0Jyj6QVdQDEzGPI7L/XlfunFJJ7JG1pBUC5toChcnAcHBSjeRaF5B5J6QMAIHZBKUPk0IPO3A1Rr1FI7pFU8pYJAJp8V8zQ2H+XUpb7ixSSe0Qd6AKbuuP+tjAUDgyHyhA9tZRCco8k60exsFHO3hmS3vcPcuU+2UIhuUdU7v1m2BhHZzIE9vWHyhD1RAmF5B5ZJ4YpsGm+myGw5wLXr/vjxRSSe2RZPjbDpv4uhsDubnBQjFETiigk98jKGAa7NkcYAjs7luUePaGQQnKPrPVNYHdVPkNgW0tn7qaox4soJPeIKpljgo3hCYbClnrO3KOinyqhkNwjKn0M7MyfMBT+iivLPeq5UgrJPaL+OQ928csZAqW/msrWIaPfpJDcI2t9Y9glr2cIFH1rKMs95nMKyT2yfk6AXb0NDIHcWYoz9+g6iykk98haFgO7xBUMgcznnbkr0U3XUUjukbU8Fnamjy0MvpNlucNw7n4KyT2y1iTB4ZZ0Bl/+XDOczk6nkNwja1s72CmJ/yti0JVsbAenultKKST3iDo2RFF777nDwmCzZk00QWV4oYhCco+ogvejnDnen1Ya/N53XQSnnpkUkntEWf85H6ro6ekMuqJvjFAlbqaQ3CMr/9NYqOrOzbEyyKy7k6EyfGClkNwjynp8GJza/FnEYDvRBU73llBI7pFV+ldrON2XxmDLuR5O/bIpJPcIy3svHqpmvzPYiu+CU+sMCsk90o5NMsMh+isGm+URBaqkNArJPdJK918KB+O7DLaSsXCKTqWQ3CMu8244KHMYbEVD4GTcSSG5R9yhy+Bg+ozBlt8XToYNFJJ7xG1rBYfohQy2zLZwUlZRSO4R93sCHOJXMNh2JsJJWW6lkNwjba0ZDnXWMdgWGuFkWC25S+6R94sBDskbGWSWUShj2sjqQ3KX3Ov/wSDb1xRlYndRSO4Rt9KZe72g5z7XhDKNj7P6kNwl98TfGFwnL4dL71wKyT3i1hjhELXUyqD6PgZllHuLKCT3iPs9ylnklAIGU87VcDF+YqWQ3CNuRz2oOmy3MIg+i4NLgx0UknvkHekNlWHksRIGTWpfaAzKo5DcIy/vSQNUxtt2FzNISt4ww8U0x0ohuUeeZU1dOCkXbMwNUpc720Gj5d+sDiR3kXkzXFKeOVDMIMgfBQ3lgWJWB5K7sKypDxel++LsUgbs43ho1NvE6kFyF1kvmqGR8srxQHsv2XQWNJRheaweJHdhOXqzARrRD52wBJD64e+mDGoErZQfWF1I7qJk1wAFGlET00vpl4Lfp1/b0KzAjXJ7LqsNyV0U7RtugkbcB9n0mfX46indEw0KPDXbxGpEchclaS/UUeDSYYuFPsnb8f6/20QrqIDp1VJWJ5K7KMlc1FUTqzL2uJU6Fadvmj3yzAQFlei/n9WL5C6sBTvGJqCMecSSQ0Xeiy9K/WHqdW1jFVSu+U8WVjeSu7BkftUILtFnP7p4d26lqRZmHFwxbUiXeiZFQVUS3ypm9SO5C2v+uubQUKJaDXlj+fb9R45n5+YVFBWVlJK05GUdP7Dukwcva1fXqMCrmCmFrJYkd1G8qgXcKab45udePXLsoxMefeS+0Tdd1a9bh0Z1o9XQvYurvrVL7qL4l7NREUWx/fks5XULqy3JXRRtGmxEkJh6L7OyGpPchTX19aTgxH7G9GMUknv1Zs2dEYWAGS76aG++lUJyr+5SbzHAL67ne/MjBawJJHdRevQ2I3xniG3fUs3d8K8jrCEkd3H430b4QjHEnTFs5pKbFDicvZU1huQuDgwy6n5+iWp84dgPt+RZD440wqHpj6w5JHdh3XJlrAIbY4Mks1Jx54opofUV4+ZuOF5CkpmTTXBImFXCGkRyF4U/3xALO0OvN+dOGtK7Q5OUhNgos8lsjoqJS2rcrvdNT3++Zm+OhaqiL+vCIWpyPmsWyV3sfFTtXen4xcn8nIy048ePHTty9MiRtKPHMzJPFtJN0dq2cDAOzWBNI7mLI3cZ1d6TJ6eyatadVyuwU/rvZI0juYvS7QMMcEgYf8DCqmQ8YYRD502sgSR3Ufh7VzgosQ/uL2XlihclwqHFt6yRJHdRvKIRVDH3Hayi952d4JD0WQlrJsldZL4aC1XM2EOshPXg1XBImFFja5fchXX/KCNUxm4/ZlhYkROjFdhFP5fLGktyF5Yt3RSolJT+t97/xMtvfzR/4eJlK9es+6eAJI9+fU9LOEQ9WaNrl9xF8U8pcKdAMZqi4+vWa9CoYePGDRNNUJkfreG1S+4i61kzdDE+mMeaTXIXpfv+ZYAO5kdqfu2Suyje1EOBV8nvFrHmk9xF0S8t4WA0m4yKggp0+KGYQnI/FeQubIAqGfqsKqSQ3E8J1qyZdVCFmJG7Sikk91PF8VmnKaiQYojv9dERCsn91GHN+vb600wK3NhOM7W7esKioxYKyf2UUnxk9dyX7rn63A7NG9avl5zUoHGHnv966PVvDxVRSO6nsNKM339YsnTt4WIKyV0IyV0IyV0IyV0IyV3YSO5CSO5CSO5CSO5CSO5CSO5CSO5CSO5CSO5CSO5CSO5CgDWUWP9Iz/qIanbZMzsoJPdT28a+cFIGbKWobrkfX/Ts7QMuu2LUq7+WMjDC+pIJGtGvUFSn3DPfusQIp0bjDzAAwno3PNxtpaguuWc+mgg3sU8W02/iMZTzGEU1yX1RE5Rz/lH6ScyD6swBCpzmUlSH3AvvQEU6ptEvIrUe7JQnrXwKTnF/U0Q+92N9UbHeFvpBWPvD4X6SBY3g1MtCEencD7WHS5dnFy15Kh6qqfSD+AQOZxaR5DiUeZMiwrkf6YgyyR9bSfKXKDjEpdJnIq85HBbR5ieUSTlJEdHc87qjTNOtdHgIqrHUJ3XGTT3atOly998UZU/r59CuMBZlJlJENPehKJO4iarDMXBIyKYOhQ9FwSH6c9Z6aQlweJcOl6FM3UyKCOY+Cy7vssxwnxbPrkeZGPl9fwwOyfl0eB4uL1NELvc9iShzCV0WQXUDvdsMjRGs5XKS4HAXVT/CpVUpRcRyvwRlDH/QJd8MhzoWevU3NOpYWLvNgGoVVRnQWEIRqdy/gMsganWDajO9i4PGdtZq1tPh0MxKp9ZwuYUiQrnnt4DL79S6E6qP6R20vmetthKq+1hmEFwSCigik/urcOlNN29A9RS9yoHWl6zVRkO1lGWegcZCiojknt8ILp/SzWKobqNXxyX3MoWJcEgoZJl50BhFEZHcZ8AlpZBu/vZhaWY/tBaxNvsGqmvosgkaDUopIpB7aTu43Et3J6C6kl5tgdbPrM1GQDWNLgUGaPxBEYHcv4PGGrqzGuHQl15tgNavrMWKkqDaSI2W0HiJIgK5D4RLEys91IXDFfRqFbQ2sRZbClVyKTUuh8ZVFOHPPTMaLmPoqQEcBtKrRdDaw1rsgYqbvgcaCRaKsOc+q+r3y7pwGE2v5kNrP2uxTlBNptZL0PqLIuy594NLbH6luU+iVx9L7qr9cFpGrc+gNYci3LkfMMBlAD0V+3AA503JXTUHKkM2tVZD63aKcOf+MqrclnrEhz0Br0DrAGuvYVCdTjcHoNWNIty5XwCNdfS0FqpUejUVWidZe7WCajjdlBihEVtKEd7cT5rhklhCT3PhUE//eQbJ/RCcXqO75tDaRRHe3BdA4wqWc58Pi8T3Se4O/4XTSro7H1rfUIQ39zHQmMJyzoXDq/TuP5K7w/1wSqe7gdB6jiK8ubeAxmJ6Ombw4XTHLZK7x/tQU3oYI0szkcx9O7SO0dNsOLSjDjdAq4C1VWlipfvqnoJWP4qw5j4bGi0qL3gqdbgGWqy1dsDpEXqYCa3mFGHN/VZoDKSn7DjYJR73eU0T8qYKfEgPX0JLKaQIZ+5tq35TfR8Ok6lHL8nd7rHKt7SvhpsdFGHM/bCX43aXwK5zIfXoAg2FtdZ1UBkL6WEX3PxAEcbc50FrOz1YO8Om4S7q0gEadVlrtYOqIz2dQOQ2iUnuj0AjuoSeMiacriSOOOzLoqbknm+A6jp6shqg9SRFGHO/EBpdWJFC6pYCjaasrTbC6RGW0wBaoynCl7slARr/ZoDqQKMFa6tP4fQOy+kIrSsowpf7n9CayABBqz1rq8lwWuFt9aorRfhyfxda7zEwOdDqwtpqKJwOsZzroNWAIny5j4XWCgbmqJxdsDsPqgSWNxJuiijClnufoB4/+gdafVlbJUF1ttdN0jhMEa7cSxOgEV3KwPwlb2HuS+tDWN4kuPmDIly574BWBwZoFbQGsJbaUOW7/8vyWTVSuc+D1sVBGb4n4/q/gNMsljcLbj6jCFfuT0NrGAM0H1ojWUu9WOWFDp/DzUyKcOV+I7TGM0AfQOsu1lJ3welvr/8CMZUiXLl3gtZrDNAb0HqEtdSAKnez/wI34ynClHuRCVrzGaDnoPU0a6mzoWrECmyCmzEUYcp9K9ysCcqpBrkntz5UPVmB3XBzE0WYcv8KwZ3xcxe03mTtVFB1yofhpj9FmHJ/AW6yGKBh0PqEtdM/VT+Xn4Sb8yjClPtt0IphoK6D1lesnVbD6Q1WwAo3HSjClPsF0GrJQF0stwi7zRpYwIrEQKsZRZhybwatHgxUN2j9wtrpLTj9xookQ444RiL3IgO0rmKgOshNZG6fqg95P9ALI0V4ct8BNyMYqEY+30RWcHh3aiHDK3P37kyG0J1QGUtYkZZwU0gRltyXwM0DDFQ8tI6xajkf3twSAAxtRnxdzPD4Y2KvOgBQ58Ipexkig6Bqwgp1gQyOjUTu78DNMwyQBW5yWZXMCXXh0uoLhsGynnAx3HqMIdEHqh66cj9KEZbcJ8HN2wxQBtywKosaw93IYoZY5jC4a/gLQ6E9VDfomSyI/RRhyX0U3MxjgPZDqw6rMFWBpxssDKl/ToenuF8ZAnW8bAntK1MiI5J7f7j5kQHaBK3GrNwEVOBphtKuZiiv4XEGXSGcJrNCl0PfAlbWn8t+SWfA9q39YUsxKbl3gpsNDNBqaLVjpabDydj5dANU5i0MnbR2cKrfLQlOwxh0R+A0S88QfGxkhf64wghAOf9TKwNgmdkCABJH7pDck4O8Q2wxtM5iZX40QnXJXvKvhlBdx5CxXApV3LulLLoXKmUjg20bnL7WlfsqVmR5NFTDA+l9OFQJS2t77oVwl8YAfaxv7saRsr7PzyPJGVApOxmI1PceGHrbi3+xIk9CZVxCksVNymJisP0Cp3W6cv+ZFSg5HWW+pN++R5mmJbU89wNwVxTcw0xXshLXQhV/gDbpBqgeZwAWxVR+Gm6dEar7PcZJRecwyBbCaZ+u3Bd56RQ302+D4PIzg8O6d+2i+Ss2F9W03NfDTRwD9Sy0BnudfvCY5ztEJ1asdPuCWZ/t1blhp46FnkrOgirhhOdtMvMYZB94+146WEfuD8Pl3ABvRFPNZuBK1zzRPwl25i5DZ26vSbl/BzeNGahxevYknGwClekQHW6o+nkq+6EkAFCuOsAqWKKgSq9iNMDd5UZS38sgew2qJF23ceJzVuBquLSmv/ZB4/+xd+7xNpdZ/F97n8s5jsPJhUI4CCNOY6RM0qU0/Qq5dElF1CiXDBGhlEwTSiZTNEYNokEuaU4kF5LQxeUkXdwvJ4xcOIdzHOey916/1w/7u/azv+tZz7MP83v5zsz7/zGyP9/nWc9an7XWWLxQjo2sBSp1B232jNzfA4VfXUT7vJB1HgBhHsDz9OLWuhJ3w3mqrpd/Wl2XysEUCPOja5plCxQ4vvuXIApkz35jxOxczSbJBlIwR8w0VV6vQI5TXy2e+8mXe82pMjktum/lR/NWZJ1CM3nDywLD9TMD3pD7eFD4LcaOdEsPRY49ieotrt7cfxZbP+EywXX2mb6a+wd361Au/ZmoIzCqGgCktBihEUP2iHT4f5T7Cz8DsiXy3G2xrqa2XK9b/0xDH5ylSttpeWKqTPg9zky/Lw3O4m/c50uUWVsHNDSY7wm5j4CLPNKxNei2+BG/hzAVitwd3QMNVchWIdRAw7nKup7kSernpModclDDA85BEOBaTnvEQ5hVGEE3OE8HtKqq/tVoEnYlKVtCJKnDdIfzIum2LRhVGSLJWIgCUxNAT7tfPCD3/he7Jb4ZEJqTOjuRGTJGcn+UXw5ATEMdQ52QhzfkqrmSXHO5YZWY1Ph7eXBorNRm25v20LQA83SfWnqv3YG2EM2VqyW582+pD6tBNA+cRB1TfBCBv1nHdo0ggivWXfpyfxQUnsQLpS5EMsmQcZjNyL2DyZZ/+Wn5LGbKW0fLAGV+GLlvMTuK3nLF9OH42wcAKWp+/RbTWKkMUHhFkDvzgP+gArhJmGCW+/1KIN4VGH6lq72ujgMivv/ZId17+8WDQ/KiS17u7UBhIF4oFY1PsNNUvvfTkTgEwrRFjlv1dwbRVNeUNQoc+sci91r6ToDvwruXay7dteCLHFT4tWnOTn1Q6GuUezY6BAYDzx+Ncm+LxK4mwFKV93Hk1gAizQndvr4SHFI2XOpybwkKL+CF4odIMtHNDNZj0Ic9gYi5QFQrQh5nUn0PVAjVAaZV+ohR7keBuBcVFqeGLyMu7k83rf6pbTF542pe7kUPgUPFOx5oWQYcxqCbzzVy30xtZ75GHdo3BIcqO/hAkYhfiQ6HIiR0TfASl3sjUBiDF0gOKCyXz+leXNjQBTlKrjBPrzkAYV7ShuBwiN4QRr/5eiBuVL++xPNKGR4SV3cssAtmfJw1L4OVe3EH+istCSDiCXp/+T6S5u0rct/s/BWTn9l79phuDGEa5aKLokpA9FNyO/eAw6eXuNyrXeTJy3uNI/gO+cFhCjp0AirxszzDS48/yP6mfaimo8MmcDgudDZy5s7MBDiLfxKyOI+6lchzO6hU/8Ig95/CF5Wz4ixxYii6qAVpe2S53+xYoZ3Nrk3CZYjc5lLG4lP9YvWSrhQpXuJyTwaFaRfcB2r0cU8A4jsuVTHW4k/eaWhEXKImzy9nYxL6BZOEJB6X+V6ZJCQQlVfBBnQoOLhtw/IF0yeOGdqna4eqEIWv7ScBSe5bop/0KUvQ4UEavyfLvZXLCn1jLlWbygmOtJHCbujgk3Ceey5tuRfARV4jsQoUmILfLeCQUIwO9SDMLOS5xpTJwEGaz2EF/zqZBmEa2uSsg5QmCnfYjjZWd7cjhnbMGdG1Zc0UMFFrlSx3ZTmxPxOJg2WZOE+Qe+A252zPRWIMXTb5SFAlQVeEDvWlw+RSlvtRkK1KMfORyU982M8uXQ0mGfdyjQCisZxmilM7d54CYhbnZmtvI/cTTgYyfDT2Nq9jyxx9Z3kQ0cvoBrfcf0rl276o47husXQr3hjVSFZeORfOUJZltOR6uB2jCQ2iCYGXsNz3wUXu3ZsKCqdFk87DnBE5rsBmx9kuZGhIAbrCVUBs5l7Hw2W5q4/FUPiral6EGlZDqaghVF7Xnn0vOgnOlgFdXWGyrpuSDphVfk3w+jqlfHI5x7JgMXo9AQCaFV/act8CcldNzLxhGkTwEBAjlFemyaVWlALEm+im2Klxt1YtOkD4C9DhZggzB3k+gQi2RVkry++S7e6xcyMvd/plhjvZlG3aetjVIZPcTzlp0jaokpOsrao9DERNZNg55O6eOZd43v1LUNl84R4cefZhqCoQ/0CHdyHM46jjdoO55wfNNoxJQNRlp2P+LF8oSvScFf6oZsg+09hJXM7KncLMLc73/KLwZlolyL2W4kdNduVxHtR+NQOA8OehzKUq92UgZlJkCrcfN3hwqnOSJL7m/jWnoI4hQJQplCpRY7W71tpxE3FqoyR3dbZpYfgBeQfqCIxNhdhJ7fKjZCObhRhq5RyvriAxWJ31HJHcyfqZFacvKi6Iip6INyGCzz0q949AZR/aM7sKQN2RzAOeqO92VWlmZ1HtaYfdAtjPpTGkC7VTK5/iDsSuVnJfo1xfSTtQdu7ERtvMfLnBbyLiFClf3B3ClCvUD/7xl2DwesctcAqjyU3QlT9WQAQjPCr3f0Cpp1ll+riJ1u0Ngwh6AJEYYgYi1LMsYb2ELh7kpxTthAhGc1b/9+zlviOJwgl5cYdCfMM7Hn321Tcnz/14+fqNGzdu270YVP5k8jO9iCcqORWvEnQxCxyWCt3I/8K/QZjX+Gn//A+RFwdEY4/K/a+gsh9tyS7Lji+/2TCI4Nd8Q9oeq7pceSB+hy4cy1NCiXZl7wzmPPQfRg3fAEQVyO/Un4z0ealc0XXqpjN8jxExwNTg1wMHiz7T/eAwTNiLszHvciewyUU3z4NDthBarfem3F8D8yRa8cZOK3ZLTpgWnx8HxE3c2bQc9fwWiAohfWLman337GdMevJmu8TVosjWoPHSP6ofHNKHfyffG4JRqAtEcEd2svP9FCBDTc0hcxIi+XAk91UQi7TGpHHq7n9Pyv2l0so9y0epLP0ukPsFz5WSdu/rxJMB23mW2/QbMzvp59NRmHNYNdgIcqefvyRsUqx5BgVWOUXOd0JimET8zrTDsE53KXJWetuT1CMIIhnkGAXiDiDDIa0p+Zd4IPybPSn3YSDMp5bopllvnioPIpiu2ajdlHsgyXfR+/qX7HMYSQ2+7rXAUcdxO7lPi3hov2W50iFLfhXIgzWeUqJ/vyO1vcgxUpdf8ynJTnocmzyDraROoLs9KfcBoIKWZMfzjr8SkAcRDOM7+3LiyDQmMAdUE6rKcP4aPqmZSDxQOwuH2AYRjMczNcNhb56l8e4AatgMKjWEs0i6CIh5ujAkDVRka3JrbdFke5wa2nlQ7n0s5C7138XliR6cYeIWymnuPXW3osRXYkdEO/502wh8lamJhXEiW80FvQ3nGWy7Q/iMbTk7yTgi2WSh+16XJ7wMOKoUI8FfKYekjblXnvKg3H8v/KML5IYjwKaosgPkQQRN+FanPjRAVOIgRJBcons2JBRrr4RrKUj1hTtwQpYOuv4lYdemf5/l/N9yUpikwqhnDHCUyTOaW7sJW8+o8MzzZ3D4ClWyU9Sb23tyfwQU0mLNX/aTnqIUrvAnzTpXkqRBECWCiRDBj6hwTDGGEK/xgcD7cmcUk8Tr9gFQQVVkK1dmk715sNO4z9zksa0KfKqpNnAsRZ75ght8NETgW+M9ud9fOrk31wWAy+TVN6chkq2ue3g6ytQWBs2thDCd9Q++zq7xT42kLywEEdzzG3oly3xBni/hAlD5WjhUFGYZfxRooLPNE5WKUe5X5JKthUpDecMznpN7W5PcZTu3/xh3NhAzxa2Wh6PToY0CKKM4wIfrbuFXtP+JlFzLTxHMkEQcEClOiJKPMvOEk5hCD5WPtauIVeJz0TiYrLKuLYboalG6ftEwUfQ5z8n9zlLJvT+FDVFMAYVMFIwXUBzdcr8wpsuovS5Plqn/tV+MtpPdEEKJNAupCP2JvVFLIhjH5s0EFSU9KLlmfHw5VDqIuAv4KTa5TyR86zW5tyqN3AsraZOB4+VukffYpOBG61zuANAPxc3QVL+rqslE9cyPM/xilwPDXGsX9EjUUhVURgo2GGZWhNy7nsfbYAj/cdRRRhrntq+s8vAv+W+Q+xw6R4XZdtzb/hVWro/BWcrtRRNjIQLfKeVUiuev8hI/EI4ZbJffrnO+PhD2yw+eYN8u8p/cSyjoy8uzmEROrhCwUhaXJ110Cqjn2ViPyb2FUe6SUy/hFHPCSPb53lxSMDtRkaLETP1Uj7WaZvx/AUHhUk84S+MCq/UIKm3QREeLvOp1oNJe6qUi0gI2dr9c9udSC9o6MkS5BxTFlNnpLblnlELuh+P13qonZPv8vUows1FJhj4U85yDSXzX4HNC+bJ78Jy9Jv7cr/UdGrgN3ExAE9fTYiYtHUCluWQ0INpYmblzhWSz6ZXUSpB7uKPK4baQl+V+ZUybKWAUbzknjorDhCpmRXhXmp1GMzv0FgXqgZ3vHrVE9AghYtE5PfqoeVAWpcoPaKKORftALzDuTVknhO7y1VfCFkMJ/wnUcrNhPu4LEMk7XpZ7LbSgmeB6vksuFTYDhcprEVeknPvQ9se+J7AVP21gt9qFAiqPFeLpjoJ0pOYs2qMhU8ZisdtIUPEXC5VXYrVVZ5poFDG0Z9xlqJsWKovH0w7+h8uduk2rBk1PX34aNpH4SKe4c2rfjjJcpiSNralWYAewEk1615U2i/A7P2Rnugo1wVZBPX+DKPbId5m5Kfp9TUw6EFx0Rz038o4nYo3y+O/wHy73oXRQmv68JGGEs0K6eiLLUTGRzU1zbC2UJqXuP/nmJiba7xDOQD2Z5nP7IDN83SrIrG/6b3gT9dDh/Qby9IVI5ntI7o1jlnuQGjg+4rNYwsu3ErC0PVY608MiLgP6vJXcU6bHurrKvm9tuY23ZjNE4X5I5AoVLvEmus3kNFsnLy801BfylFOrZp535F4rZrmvEPPPlWUTdxowVHs7hLY8o3u3tdFV4/8MHHftQCveh2iSi+yXqnZDPacgitF6xw7xKuq5SROrvA0uTqKWH7U2HmIhRDLkP1nu3Zj8NpGkxihmufubv1WA9rwJfMdksKJuLOU4cFHpsW/QkmV8gUZmjJUQqoBKb6nASd+yltNJmjhtGqjICbiJ7FwUKaGcsM0zcq8dq9zzU6V++GJQyBA32WSsXTBvXe6FzMXJYN7PV4m2wgmL5y7cGkJrNkE0T8bwvh2PYp85u/RQjv12oZYF4DCPL4ILBxXX2Ss8tPcrPZqdvPpUrR/D7R5/BF0cB4Wm4mXS2Pzme7Z9z5lK8JAFDkofxzsU3Ypyn4cGgjO63P/yD9w4C1bCclF1jn2rAX2n0ss+KSD9vzrsNXgR+qGWA36rdtRREMlar8i9KXMci9wptkxmG9x7dZQ3jrGeleB6d53UmBS6aS320yGSKShz6Hp19dAZiGZZDN0Aq2JJ+iQGdINziIaoZW+87h/2C4jmL6hluPSYIM6kK8unQ560iJnlftAvLnreIstd/bqSQijyKte1VJW3saZrh7pmxuJpOpgevaylHIiDp+TiwPZYBrhBtuxoUgMeKTv4hBSQyVaek5eBwyYUmKsmIz0i91tFuUv9ZImchTQLFO6WNxIdRIk5Pq7N7EZ2Bz3dKuUDovGkH0oUtHB9p41ApQwaKfYL/aeCCj83O3Z6oY5didohAVtBgY4EuRu8dggFQjcpgVixB7uZzHIP1ZeraWtAoa1sqVmHAjvKsc+zx9jTbob+C/sJImmHEr3dBbQ7QaVRDCsiyqFEng9UJsu/juyfbwcO1UuECJPayDh2JFuX4Tb4IYK3vCH3TrHJ/TNw+ETO2/ETXAZKHTUKRc1J0vo0+uWugQpjxFqNrNZ/Ok76DeqoBukLFpxdDVGkJmvKFb2Mb9tERmNN1Sp/AHkCN4NDmSMo011JbRZ5Qu7dBLmL2YTaQe2EQeIRuUg53GKQDcRvFdr/4BApR3djlGdyOSwHKjHZnZdAXm8thbWtUeR3oNJeslPLiaWt5QC0k06LgZAzjMPVyeAyexQn8HQvThFrjiL/SmQHNBOzDHKfL/++xBIfVV+kuU2fRnV8pxYb0hs/oo6g87BI+lmZR68wOoZ9PY+iSD9j2qU/RLEIQ8v/2PWWjhMKkKC1kZpfJgFc1ZXjf3+m/S09V0ddET5wKJsd21HZ0hNy/5Nwuku5s/gDyDHDIPctlkWtI1c40tuPKjUY9b0t5Yo7iWMriDHsCb4UVKagkUGSo1Ao7ieUGKfmfREOBzOOIHHsWiDqFxr7y5vg8erngraRSiyXKPvq5bf2Di/I/Z1Y5F5AjpiHrMbF/x6jKIqHSE4gT6idPni4DyJ5MOpJN9aU334GNax3fuzk/fyUSHqyyHS2fL+thCi2GceIrXHuqtso/t7dGAjfcnO1KgO/YCYnvRsPRJMiNNNQcfN4Qe4LQaGO5XHky7Lau9eHdZcSS4xdl2UPaYe60czH/DLSTtZZYHPp5lE8MNg9NJ7YEEMt40MUOWAcUvqWW+5Pu1oUMysJUznZZGoGFoZj/XLh4C6/J0SQ+iPaWcGJW7wg929j8MwU1TSWO8aY5N5FPzGV+ClFGGX+NSgcUYw0l4eQYEc5JeSb8gwVTkha2YtG6siOQqK8sLCGfTjAknBlw+k83NkZIukYkPrL6YxwxH3V2ago9IHSeJOQiTzF+p8i6QwSHtmaXRkFJgOYquPPm+Q+EZTiM3IUNpW81EWqTTBT2XLQ1Ww9XIwcs5UUspCqPY5GEml9pcz1oNLZOGhmUUQ+J+659WsntYlTH/9FojOYDrVtzv+u3txNi4fXg0gS5yFD3ht3V4O6g/ehQ1B5FHzjAblHFcnjUE9huvkZPoSRu9DUEM/6rp+WBxjdAZEMRCy8TM7kdzC7s/fQD9c0IE6dLkEThyO23Mk8CoaX0yKm+r85AXT4hgaEWiJxBbk2OWqskZr64nvl8D/FZC/I/TqQH4/EOPPhjn1Mcg9ebjRvZPpko+qr0bv9MulrZc/eCcbXeBGds751YrIpBY1kkaoMjDGlZlZxo+7+opWp7hn9ILjHq5xuBho6HDG0o1Tfz3byPusFuXeTkwPEiYpyZZGrQQ7WDdgS2n120EGbtM3Ca7IPHzbMT/zZZ9qU3Af0O7vXxzqIZ7FUxJDbVbegygYgaPLUq35gSH0uz/SrKL6fIy2Ao/GnyFPMvDGUL6+zF+Q+FhRWWBSk4r63XaA7zDQZK60Ao8hvbKq6hqqr/vPjyfw4eeJaw19qKjhUch1tZxJjHMQzRa6iSQtYZ0ivbJrotKalu2V7bI5YS2QisqLRlSGKxHuWhlAHFTwSN3F9Urd7Qe6rQWESatgUpz8AiTuNci+uKv7AgfbgcE2RzTCMa+iI8WXr+9EEp9/KRHCYY/hYasVQueuNBoIpAGJR4JCun/XLXvTNJ2U8PnmbeUIrE7Kefvf/JFKW4rZhH+ciIYVEDfOdBiqimRfkrh5eMBB5AhTqlT8oN6TJcsdnhc5PJaxI3Gz3hVYB0/KA3LJSbmZLGojVs6dilHs/3aYec4awtbj9QR2Ns++TKeMnTp6zemcAGeR2XcquFG6aM3ns5CkLvzmGJmYD0Z0plGV4Qe7YEmyKBaPsvJ6NzHLPVjMLn2l7wv6KGkL1gOct2djLT7bcWQMcGuQafma4Go3cJ/kN5NRMJYwiXva7x1o6F4pxZorSXV6K5d6T+8s2YyXWxFGuXDpNapjljj3U4z3ERx3ShNTXgSXuEGrITtIe74evAoeUb41rZVqgkZZyzVhcvnRAaGUnz0SsfABRrEIZcwNT4lJamEiniAfk/q1FK+YRknGZ7SiQZiH3n5N1Wyve8EXo6jRqySkHHLfbzr5rQH/2rgi1+z409/M+jkbqKnkWkUVgcOSkCytV7VksuhXs6QhE0sLoo7KLB+Tumqvfg7vGWinLxQSSZblzKw/KhlVx6nEgav+CKlLx1my5PlZJHYsavlI+rmo0Aapn2LwY5qEeRRN7gKCtUsJapeuwNKyFKKZiqTheD4iEkbk5DZQUmTfkrnqAL3MXOgP3KSGGBNjIvejXao3v7L2YP6k6ENV2osSJSuCmQoH9ff7I2XpUVke7Msm4sIJ9jwTRxOkYdtSGyhp6pVqBSj20R5gkPA5jhV71hD9O7STwgNypZyPM6y61dwWHjHyUKJTkTmwtDwrX9nn0JsUJU/V7u72uCoNQogcolLu39z3qi7d/CLXkfvrqgJ49h767C83sld2l8gqPiobyf0W0RG5WHY6l5Js00HGrBxyRTEdklROocLoDOFTZhyK5otyJzDiQqL0VDQRugGgSZUNW0e0g8gJeJDbEEnh0hyh2o8LDoOILYSnIAeICF15nVQce31dekfv3fvVCVVIvu68Fh7SNKHPC9hSZnwh6Wh5EI9tcx8wTKHPyVtCT9M5FrNvJJmnZ0P4RypsIjmEpCPnsEzwmDrYElkHoFbnjY6DQlt5YBeNSwSFlFRooApXXUceyVNDg61eEFvzTBwqph9BAQXvQUecimlfXq34gme8Mw+Ofl1bJ21PBPsFjpGQEd1TdG/CO3A9XBoWKQ1flI+Kp1YOrAFF2FRqpZt3YuTUDWNJXoB0vMQP6ZYIvxwOHr8+pi99BYHfeBWvLq5del4bL21NXXnsWI9+77kn/4AB6R+44D1yUvTIFFCp/FXssukF61o66DFykvVKAloTeSwGiUwgt2MgF8LduwItKE6fRzoKx8un+rrudqTQ0c7czXRBL1IaRZusRvSR3HAAm6m+30lOcYjAJypH+i3VAodbLMYWmuzqHT+vEfrZfybJ26lWc0GElXmRmy0O4VM6ozbsp2dKgEmqljpHWoFIBL5RNf7gifEJ1+TyEHpN74H6QaZODVkzwxVST2fCn+xuc1V/cVe1HZ4UwRg5N7dv2jnuHzj2G9uTM6HtT5XM/VIsn5+bixWdiOYCGH6Idu+sBkboQVVZIsb0990EUQbxgQpunvDj0tanf0R/lHblj0UMgkDzeWolLr3as4bYnUeHR3UcD+P+XnJ9/zsN/F6ezdqM1eS9UDB/t3fe4bktQkV2W5qIDFXy9AuC/heDzPtBx11a0J7h8yF3X3dBm8IJCtOJ/FK947emeQ8YtyWfOfiBEg7bMYIhix3+r3Ill6cByy1L0KN7nOETxGJaGVyCKb/4ndzwz3i34Sn3Xo2fxPiGfMDZVRPZcfPpfLHciuPLp3ySQd+uul9aWoJfxPpVBpdWFONWJmf+T+3mKt30+b+7c+St/+L/s3c+Lr2MYx/HLbzqnbJ2zkTjEUqNkyAZLk5rJjvxomB02o1lMGguGklIskKSMjcxSU2NnNQtkhQ2hsaCZiYn0nW4baq57eXvKVV6vv+G9eXquPvdB4z93U2S3tBG70XlN7gVxZ2TnprkA3pA7BT0Q2RVtxH50npJ7QTweneM24M/oPCz3gliLzg+TnETeL/eCeCU6X7QRFyKbl3tBvDvNZsbtkd0s94L4eJrNjIXIrpF7QexF56024tHILpd7QexH5+U2Yj06v8m9HmaXRrbWRrwRne/lXhDnI1tuI7aj85ncC+K2yJam+QT4RO4FsRDZPW3Ej9H5UO4FsRLZrW3E7JLI3pR7QTwf2XXTfAK8JPeCeDuyq9uQucielXtB7ERnNskh8bLcC+Kr6Pw8yW7WktwL4o+LJhlFfTWye+VeEecj25vkP9Oc3Cvirsh224gvI7tR7lT0WGTbbcTvF0dyTu5U9GJk77Uh10ZyVu5U9FFkr7ch90Umdyr6Zprcnwm5U9/JmUg225B3IjuSOxXd0b/eNOTzyA7lTkVPR/JcGzI7E8lPcqeiD6Y57ro7ku/kTkW/nu1f1Jxg4/2yY7lT0kaccuGgjTm+Pk5Zb3KnpJP1q+JvV64ctlHfzsc/bthqcqeqo53NJx9cfGh165f2b3z9/uoji0tPvPDprMkd5A5yB7mD3EHuIHeQO3IHuYPcQe4gd5A7yB3kDnIHuYPckTvIHeQOcge5g9xB7iB3kDvIHeSO3EHuIHeQO8gd5A5yB7mD3EHuIHeIBnIHuYPcQe4gd5A7yB3kDnIHuYPckTvIHeQOcge5g9xB7iB3kDvIHeSO3EHuIHeQO8gd5A5yB7mD3EHuIHfkDnIHuYPcQe4gd5A7yB3kDnIHuSN3kDvIHeQOcge5g9xB7iB3kDvIHeSO3EHuIHeQO8gd5A5yB7mD3EHuIHfkDnIHuYPcQe4gd5A7yB3kDnIHuSN3kDvIHeQOcge5g9xB7iB3kDvIHbmD3EHuIHeQO8gd5A5yB7mD3EHuyP3/7q926VgAAAAAYJC/9Sx2FUPoDrqD7qA76A66g+6gO+gOuoPu6A66g+6gO+gOuoPuoDvoDrqD7ugOuoPuoDvoDrqD7qA76A66g+7oDrqD7qA76A66g+6gO+gOuoPu6A66g+6gO+gOuoPuoDvoDrqD7qA7uoPuoDvoDrqD7qA76A66g+6gO7qD7qA76A66g+6gO+gOuoPuoDu6g+6gO+gOuoPuoDus3UF30B10B91Bd9AddAfdQXfQHd1Bd9AddAfdQXfQHXQH3UF30B3dQXfQHXQH3UF30B10B91Bd9Ad3UF30B10B91Bd9AddAfdQXfQHd1Bd9AddAfdQXfQHXQH3UF30B10R3fQHXQH3UF30B10B91Bd9AddEd30B10B91Bd9AddAfdQXfQHXRHd9AddAfdQXfQHXQH3UF30B10R3fQHXQH3UF30B10B91Bd9AddEd30B10B91Bd9AddAfdQXfQHXQH3dEddAfdQXfQHXQH3UF30B10B93RHXQH3UF30B10B91Bd9AddAfd0R10B91Bd9AddAfdQXfQHXQH3dEddAfdQXfQHXQH3UF30B10B90hcCKiPodek2oAAAAASUVORK5CYII=";

var LoaderScene = cc.Scene.extend({
    ctor: function (bundles, callback) {
        this._super();

        this.bundles = bundles;
        this.callback = callback;
        this.horizontalMode = false;

        this.updateSize();
        this.updatePosition();

        var bgSize = cleverapps.UI.getBgSize();
        this.bgContainer = new cc.Node();
        this.bgContainer.setAnchorPoint2();
        this.bgContainer.setContentSize(bgSize);
        this.bgContainer.setPositionRound(this.convertToNodeSpace(cc.p(bgSize.width / 2, bgSize.height / 2)));
        this.addChild(this.bgContainer, 10);

        this.bgContainer.updateSize = function () {
            this.setContentSize2(cleverapps.UI.getBgSize());
        };

        this.bgContainer.updatePosition = function () {
            var bgSize = cleverapps.UI.getBgSize();
            var scene = cleverapps.scenes.getRunningScene();
            this.setPositionRound(scene.convertToNodeSpace(cc.p(bgSize.width / 2, bgSize.height / 2)));
        };

        this.sceneName = cleverapps.Environment.SCENE_LOADER;
        cleverapps.environment.setScene(this.sceneName);

        this.onBackgroundLoaded = [];

        var waiter = cleverapps.wait(2, this.showAnimations.bind(this));
        this.loadBackground(waiter);
        this.loadAnimations(waiter);

        var customProgressReport = cleverapps.platform.oneOf(Instant, Ton, WortalPlatform, Samsung);

        if (!customProgressReport) {
            this.createProgressBar();
        }

        if (cleverapps.platform.oneOf(Wechat)) {
            this.createAgeRestriction();

            this.createDescription();
        } else if (cleverapps.platform.oneOf(Samsung)) {
            this.createAgeRestriction();
        }

        this.needPercent = 0;
        LoaderScene.startLoading(this.bundles, {
            onSuccess: function () {
                this.callback();
            }.bind(this),
            onFailure: this.onLoadError,
            onProgress: function (percent) {
                if (customProgressReport) {
                    cleverapps.platform.reportProgress(percent);
                }

                if (cleverapps.platform.oneOf(Wechat)) {
                    this.logLoadingProgress(percent);
                }

                this.needPercent = percent;
            }.bind(this)
        });

        if (window.wechatFirstScreen) {
            this._canvas.active = false;
        }
    },

    logLoadingProgress: cleverapps.accumulate(5000, function (percent) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.LOADER_PROGRESS + percent);
    }),

    whenBackgroundLoaded: function (callback) {
        if (this.background) {
            callback();
        } else {
            this.onBackgroundLoaded.push(callback);
        }
    },

    showProgressBar: function (imgA, imgB) {
        var bar = new ScaledProgressBar({
            progress: new cc.Sprite(imgB).getSpriteFrame(),
            background: new cc.Sprite(imgA).getSpriteFrame()
        });

        var styles = cleverapps.styles.LoadingScene;

        var isWide = cleverapps.resolution.mode !== cleverapps.WideMode.VERTICAL;
        bar.setLength(isWide && styles.bar.scale9.wideWidth ? styles.bar.scale9.wideWidth : styles.bar.scale9.width);
        bar.setScale(resolutionScale);
        this.bgContainer.addChild(bar);
        this.progressBar = bar;

        this.progressBar.updatePosition = function () {
            var scene = cleverapps.scenes.getRunningScene();
            this.setPositionRound(scene.convertToWorldSpace(cc.p(scene.width / 2, styles.bar.y)));
        };

        this.progressBar.updatePosition();
    },

    createDescription: function () {
        var msg = "健康游戏忠告\n"
            + "抵制不良游戏,拒绝盗版游戏,注意自我保护,谨防受骗上当.\n"
            + "适度游戏益脑,沉迷游戏伤身,合理安排时间,享受健康生活.\n"
            + "批准文号：新广出审[2016]4509号 软著登记号：2016SR194719\n"
            + "著作权人：广州道泉网络科技有限公司 出版物号：ISBN 978-7-7979-3066-6\n"
            + "出版单位名称：广州盈正信息技术有限公司 运营单位：深圳彩苻科技有限公司";

        var styles = cleverapps.styles.LoadingScene;

        this.whenBackgroundLoaded(function () {
            var text = cleverapps.UI.generateOnlyText(msg, cleverapps.styles.FONTS.LOADER_SCENE_DESCRIPTION);
            this.bgContainer.addChild(text);
            this.description = text;
            text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            text.setDimensions(styles.description.width, 0);
            text.setPositionRound(styles.description);
        }.bind(this));
    },

    createAgeRestriction: function () {
        var styles = cleverapps.styles.LoadingScene;

        cc.loader.loadImg(ageRestrictionSrc, function (err, img) {
            this.whenBackgroundLoaded(function () {
                var ageRestriction = new cc.Sprite(img);
                this.bgContainer.addChild(ageRestriction);
                ageRestriction.setPositionRound(styles.ageRestriction);
            }.bind(this));
        }.bind(this));
    },

    createProgressBar: function () {
        this.loadProgressBar();

        var drawPercent = 0;

        this.percentInterval = setInterval(function () {
            if (drawPercent !== this.needPercent) {
                var d = Math.min(this.needPercent - drawPercent, 20);
                drawPercent += d;

                if (this.progressBar) {
                    this.progressBar.setPercentage(drawPercent);
                }
            }
        }.bind(this), 50);
    },

    createMessage: function (text) {
        var styles = cleverapps.styles.LoadingScene;
        var message = cleverapps.UI.__generateNotLocalizedText(text, cleverapps.styles.FONTS.LOADING_TEXT || cleverapps.styles.FONTS.TEXT);
        message.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        if (message.width < styles.bar.scale9.width) {
            message.setDimensions(styles.bar.scale9.width, 0);
        }
        message.setPositionRound(this.convertToWorldSpace(cc.p(this.width / 2, styles.bar.y + styles.message.y)));

        message.updatePosition = function () {
            var scene = cleverapps.scenes.getRunningScene();
            this.setPositionRound(scene.convertToWorldSpace(cc.p(scene.width / 2, styles.bar.y + styles.message.y)));
        };

        message.updatePosition();

        return message;
    },

    onLoadError: function (status, tryNumber) {
        if (this.message) {
            this.message.setString("Error loading! Retry number: " + tryNumber);
        }
    },

    completeAnimationOnResize: function () {},

    loadAnimations: function (callback) {
        if (bundles.loading_scene) {
            cleverapps.bundleLoader.loadBundle("loading_scene", {
                onSuccess: callback
            });
        }
    },

    showAnimations: function () {
        this.logo = this.createLogo();
        this.bgContainer.addChild(this.logo);

        if (bundles.loading_scene.jsons.bg_json) {
            this.customAnimation = this.createCustomAnimation();
            this.background.addChild(this.customAnimation);
        }

        this.updateAnimations();
    },

    createLogo: function () {
        var logo = new cleverapps.Spine(bundles.loading_scene.jsons.logo_json);

        var language = logo.hasAnimation("animation_" + cleverapps.settings.language)
            ? cleverapps.settings.language
            : cc.sys.LANGUAGE_ENGLISH;

        var source = logo.hasAnimation("animation_" + language + "_" + cleverapps.platform.source)
            ? "_" + cleverapps.platform.source
            : "";

        logo.setAnimationAndIdleAfter("animation_" + language + source, "animation_" + language + "_idle" + source);
        logo.setLocalZOrder(10);

        return logo;
    },

    createCustomAnimation: function () {
        var animation = new cleverapps.Spine(bundles.loading_scene.jsons.bg_json);

        animation.setAnimation(0, "animation", false);

        return animation;
    },

    updateAnimations: function () {
        var styles = cleverapps.styles.LoadingScene;

        if (this.logo) {
            var size = cleverapps.UI.getBgSize();
            var factor = !this.horizontalMode && styles.logoAnimation.posVert || styles.logoAnimation.pos;
            this.logo.setPositionRound(
                size.width * factor.factorX,
                size.height * factor.factorY
            );

            var scale = Math.max(this.background.scale, 1);
            var logoWidth = scale * this.logo.width;
            var maxWidth = this.width * 0.9;
            if (styles.logoAnimation.canScale && (logoWidth > maxWidth)) {
                scale *= maxWidth / logoWidth;
            }
            this.logo.setScale(scale);
        }

        if (this.customAnimation) {
            this.customAnimation.setPositionRound(!this.horizontalMode && styles.customAnimation.posVert || styles.customAnimation.pos);
        }
    },

    loadBackground: function (callback) {
        var winSize = cleverapps.UI.getBgSize();
        this.horizontalMode = winSize.width / winSize.height > 1 / cleverapps.ASPECT_RATIO;

        // OK can start with invalid width and height, use horizontal background in this case as it look better
        if (winSize.width < cleverapps.SETUP_RESOLUTION_MIN_FRAME_SIZE || winSize.height < cleverapps.SETUP_RESOLUTION_MIN_FRAME_SIZE) {
            this.horizontalMode = true;
        }

        var bundle = bundles.loading_scene_images_vertical;
        if (this.horizontalMode) {
            bundle = bundles.loading_scene_images_horizontal;
        }
        bundle = bundle || bundles["loading_scene_images_" + cleverapps.config.orientation];

        var urls = bundle.urls;
        var background = urls.background;

        var loadImage = function (retryCount) {
            cc.loader.loadImg(background, function (err, img) {
                if (err && retryCount > 0) {
                    loadImage(retryCount - 1);
                    return;
                }

                this.showBackground(img);

                this.onBackgroundLoaded.forEach(function (callback) {
                    callback();
                });
                this.onBackgroundLoaded = [];

                if (cc.game.isPaused()) {
                    cc.game.step();
                }

                callback();
            }.bind(this));
        }.bind(this);

        loadImage(3);
    },

    loadProgressBar: function () {
        var imgA = null;
        var imgB = null;

        var onLoaded = function () {
            if (imgA && imgB) {
                this.whenBackgroundLoaded(this.showProgressBar.bind(this, imgA, imgB));
            }
        }.bind(this);

        var loadingASrc;
        var loadingBSrc;
        if (cleverapps.platform instanceof Wechat) {
            loadingASrc = loadingA;
            loadingBSrc = loadingB;
        } else {
            loadingASrc = document.getElementById("loadingA").src;
            loadingBSrc = document.getElementById("loadingB").src;
        }
        cc.loader.loadImg(loadingASrc, function (err, img) {
            imgA = img;
            onLoaded();
        });
        cc.loader.loadImg(loadingBSrc, function (err, img) {
            imgB = img;
            onLoaded();
        });
    },

    showBackground: function (img) {
        var styles = cleverapps.styles.LoadingScene;

        if (styles.pattern) {
            this.background = cleverapps.UI.createPatternSprite(img || null, cleverapps.UI.getBgSize());
        } else {
            this.background = new cc.Sprite(img || null);
        }

        this.bgContainer.addChild(this.background, -1);

        cleverapps.resolution.showCanvas();

        if (!cleverapps.platform.oneOf(Instant)) {
            this.message = this.createMessage(LoaderScene.getLoadingText());
            this.bgContainer.addChild(this.message, 1);
        }

        this.background.updateSize = function () {
            var bgSize = cleverapps.UI.getBgSize();
            var t = Math.max(bgSize.height / this.height, bgSize.width / this.width);
            this.setScale(cc.contentScaleFactor() * t);
        };

        this.background.updatePosition = function () {
            this.setPositionRound({ align: "center" }, { align: "center" });
        };

        this.background.updateSize();
        this.background.updatePosition();
    },

    updateSize: function () {
        this.setContentSize2(cleverapps.UI.getSceneSize());

        this.updateAnimations();
    },

    updatePosition: function () {
        this.setPositionRound(0, cleverapps.UI.getBgOffset());
    },

    unload: function (nextScene) {
        clearInterval(this.percentInterval);

        nextScene.prevSceneBundles = this.bundles;

        var toDelete = cleverapps.substract(this.bundles, nextScene.bundles);

        cleverapps.bundleLoader.deleteBundles(toDelete);
        cleverapps.bundleLoader.deleteBundle("loading_scene");

        cleverapps.resolution.showCanvas();
    },

    createTransition: function () {
        this.bgContainer.setLocalZOrder(1000);
        this.bgContainer.transitionBundles = ["loading_scene_images", "loading_scene"].filter(function (bundle) {
            return bundles[bundle];
        });
        return this.bgContainer;
    }
});

LoaderScene.startLoading = function (bundles, options) {
    LoaderScene.start = Date.now();

    options = options || {};
    var onProgress = options.onProgress;

    var urls = [].concat.apply([], bundles.map(function (name) {
        return (new Bundle(name)).listUrls();
    }));

    var tryLoadResources = function (deep) {
        cc.loader.load(
            urls,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(Math.round(percent), 100);
                onProgress(percent);
            },
            function (status) {
                if (!status) {
                    onProgress(100);

                    cleverapps.bundleLoader.loadBundles(bundles, {
                        onSuccess: options.onSuccess
                    });
                } else {
                    deep++;
                    options.onFailure && options.onFailure(status, deep);

                    if (deep < 10) {
                        tryLoadResources(deep);
                    }
                }
            }
        );
    };
    tryLoadResources(0);
};

LoaderScene.getLoadingText = function () {
    var messages = {
        en: "Loading",
        ru: "Загрузка",
        ja: "読み込み中",
        zh: "载入中",
        es: "cargando",
        de: "Wird geladen",
        pt: "Carregando",
        it: "Caricamento in corso",
        ar: "جار التحميل",
        ko: "로드 중",
        tr: "Yükleniyor",
        nl: "bezig met laden",
        fr: "chargement"
    };

    return (messages[cleverapps.settings.language] || messages.en) + "...";
};

cleverapps.styles.FONTS = cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    LOADER_SCENE_DESCRIPTION: {
        size: 40,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: {
            size: 4,
            color: new cc.Color(116, 49, 161, 200)
        }
    }
});

cleverapps.styles.LoadingScene = {
    bar: {
        y: 70,
        scale9: {
            width: 400
        }
    },
    message: {
        y: 60
    },
    ageRestriction: {
        x: { align: "right", dx: -200 },
        y: { align: "top", dy: -100 }
    },
    description: {
        x: { align: "center" },
        y: { align: "bottom", dy: 180 },

        width: 1450
    },
    logoAnimation: {
        canScale: true,
        pos: {
            factorX: 0.5,
            factorY: 0.5
        }
    }
};
